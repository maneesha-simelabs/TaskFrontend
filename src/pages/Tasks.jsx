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
  const { user } = useContext(AuthContext);
  const currentUser = user?.data?.user || user?.user || user;
  const isAdmin = currentUser?.role === "Admin";
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let tasks, users, categories;
        if (isAdmin) {
          tasks = await getTasks();
          users = await getUsers();
          setUsers(users);
          categories = await getCategories();
          setCategories(categories);
        } else tasks = await getMyTasks();
        setTasks(tasks);
        setNeedReload(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [needReload]);

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
            <button onClick={handleAdd}>Add Task</button>
          </div>
        )}
      </div>
      <div className="user-grid">
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
            <div className="task-actions">
              <button className="edit-btn" onClick={() => handleEdit(task)}>
                <FaEdit />
              </button>

              <button className="delete-btn" onClick={() => handleEdit(task)}>
                <FaTrash />
              </button>
            </div>

            {/* <button className="view-btn">View Profile</button> */}
          </article>
        ))}
      </div>
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
