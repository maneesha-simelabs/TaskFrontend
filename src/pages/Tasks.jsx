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
  const [reloadKey, setReloadKey] = useState(0);
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
    const fetchUsers = async () => {
      try {
        let nUsers = [];
        let nCategories = [];

        if (isAdmin) {
          nUsers = await getUsers(controller.signal).catch(() => []);
          nCategories = await getCategories(controller.signal).catch(() => []);
        }

        setUsers(nUsers);
        setCategories(nCategories);
      } catch (err) {
        console.error(err);
        setError("Unable to load data right now.");
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [currentUser?.role]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        let nTasks = [];
        let nTotalPages = 1;

        if (isAdmin) {
          const res = await getTasks(curPage, controller.signal);
          nTasks = res?.tasks ?? [];
          nTotalPages = res?.pagination?.totalPages ?? 1;
          setTotalPages(nTotalPages);
        } else {
          nTasks = await getMyTasks(controller.signal).catch(() => []);
        }

        setTasks(nTasks);
        setTotalPages(nTotalPages);
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
  }, [reloadKey, curPage, currentUser?.role]);

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

  const triggerReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(selectedTask._id);
      triggerReload();
    } catch (err) {
      console.error(err);
      setError("Unable to delete task right now.");
    } finally {
      setisDeleteModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleSave = async (taskData) => {
    try {
      if (selectedTask) {
        console.log("Update Task", taskData);
        const taskToSave = { ...taskData, id: selectedTask._id };
        await updateTask(taskToSave);
      } else {
        console.log("Create Task", taskData);
        await createTask(taskData);
      }

      triggerReload();
    } catch (err) {
      console.error(err);
      setError("Unable to save task right now.");
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
