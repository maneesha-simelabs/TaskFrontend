import { useState } from "react";
import "../css/Users.css";
import { useEffect, useContext } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getUsers,
  getCategories,
} from "../services/axios";
import TaskModal from "../components/TaskModal";
import { AuthContext } from "../contexts/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import Card from "../components/Card";
import DeleteModal from "../components/DeleteModal";

export default function Tasks({}) {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
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
        let nTasks = [];
        let nUsers = [];
        let nCategories = [];
        let nTotalPages = 1;

        if (isAdmin) {
          const res = await getTasks(curPage, controller.signal);
          nTasks = res?.tasks ?? [];
          nTotalPages = res?.pagination?.totalPages ?? 1;
          setTotalPages(nTotalPages);
          nUsers = await getUsers(controller.signal).catch(() => []);
          nCategories = await getCategories(controller.signal).catch(
            () => [],
          );
        } else {
          nTasks = await getMyTasks(controller.signal).catch(() => []);
        }

        setTasks(nTasks);
        setUsers(nUsers);
        setCategories(nCategories);
        setTotalPages(nTotalPages);
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

  const handleDelete = (task) => {
    setSelectedTask(task);
    setisDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // console.log(taskid);
    // console.log(id);
    // console.log(selectedTask);
    deleteTask(selectedTask._id);
    setisDeleteModalOpen(false);
    setSelectedTask(null);
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

        {tasks.map((task) => (
          <Card
            key={task._id}
            className="cd-card"
            title={task.title}
            actions={
              isAdmin
                ? [
                    <button
                      key="edit"
                      onClick={() => handleEdit(task)}
                      className="edit-btn"
                    >
                      ✏️
                    </button>,
                    <button
                      key="delete"
                      onClick={() => handleDelete(task)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>,
                  ]
                : null
            }
          >
            <>
              <p>{task.description}</p>
              <span
                style={{ backgroundColor: task.color }}
                className="status-badge"
              >
                Status: {task.status} <br />
                Priority: {task.priority} <br />
                Due: {task.dueDate} <br />
                Category: {task.category?.name || "None"} <br />
                Assigned To: {task.assignedTo?.name || "Unassigned"}
              </span>
            </>
          </Card>
        ))}

        {/* {tasks?.map((task) => (
          <article className="cd-card" key={task._id}>
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

          </article>
        ))} */}
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
      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        onClose={() => setisDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={selectedTask?.title}
        taskId={selectedTask?._id}
      />
    </section>
  );
}
