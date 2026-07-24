import { useState } from "react";
import "../css/Users.css";
import { useEffect, useContext } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  getMyTasks,
  getUsers,
  getCategories,
} from "../services/axios";
import TaskModal from "../components/TaskModal";
import { AuthContext } from "../contexts/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Tasks({}) {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [needReload, setNeedReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const currentUser = user?.data?.user || user?.user || user;
  const isAdmin = currentUser?.role === "Admin";
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        let nextTasks = [];
        let nextUsers = [];
        let nextCategories = [];
        let nextTotalPages = 1;

        if (isAdmin) {
          const res = await getTasks(curPage, controller.signal);
          nextTasks = res?.tasks ?? [];
          nextTotalPages = res?.pagination?.totalPages ?? 1;

          nextUsers = await getUsers(controller.signal).catch(() => []);
          nextCategories = await getCategories(controller.signal).catch(() => []);
        } else {
          nextTasks = await getMyTasks(controller.signal).catch(() => []);
        }

        setTasks(nextTasks);
        setUsers(nextUsers);
        setCategories(nextCategories);
        setTotalPages(nextTotalPages);
        setNeedReload(false);
        setError("");
      } catch (err) {
        console.error(err);
        setTasks([]);
        setError("Unable to load tasks right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    return () => controller.abort();
  }, [needReload, curPage, currentUser?.role]);

  const handleAdd = () => {
    setSelectedTask(null);
    setOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleSave = async (task) => {
    if (selectedTask) {
      console.log("Update Task", task);
      task = { ...task, id: selectedTask._id };
      const result = await updateTask(task);
      // if (result.success == true)
      setNeedReload(true);
      // PUT API
    } else {
      console.log("Create Task", task);
      const result = await createTask(task);
      if (result.success == true) setNeedReload(true);
    }
  };

  return (
    <section className="users-section">
      <div className="modal-header">
        <h2>Tasks</h2>
        {isAdmin && (
          <div style={{ textAlign: "right" }}>
            <button onClick={handleAdd} className="btn-primary">
              Add Task
            </button>
          </div>
        )}
      </div>
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      <div className="users-grid">
        {!loading && !error && tasks?.length === 0 && (
          <p>No tasks available.</p>
        )}
        {tasks?.map((task) => (
          <article className="user-card" key={task._id}>
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <span className="admin" style={{ backgroundColor: task.color }}>
              Status: {task.status}
              <br></br>
              Priority: {task.priority}
              <br></br>
              Due Date: {task.dueDate}
              <br></br>
              Category: {task?.category?.name}
              <br></br>
              Assigned To: {task?.assignedTo?.name}
            </span>
            {isAdmin && (
              <div className="task-actions">
                <button className="edit-btn" onClick={() => handleEdit(task)}>
                  <FaEdit />
                </button>

                <button className="delete-btn" onClick={() => handleEdit(task)}>
                  <FaTrash />
                </button>
              </div>
            )}

            {/* <button className="view-btn">View Profile</button> */}
          </article>
        ))}
      </div>
      {!loading && totalPages > 1 && (
        <div>
          <button
            onClick={() => setCurPage((p) => p - 1)}
            disabled={curPage === 1}
            className="btn-secondary"
          >
            Prev
          </button>
          <button
            onClick={() => setCurPage((p) => p + 1)}
            disabled={curPage === totalPages}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}
      <TaskModal
        isOpen={open}
        users={users}
        categories={categories}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialData={selectedTask}
      />
    </section>
  );
}
