import {
  useState,
  useLayoutEffect,
  useCallback,
  useDeferredValue,
  useMemo,
} from "react";
import "../css/Users.css";
import "../css/Home.css";
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
import Card from "../components/Card";
import DeleteModal from "../components/DeleteModal";
import Button from "../components/Button";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const currentUser = user?.data?.user || user?.user || user;
  const isAdmin = currentUser?.role === "Admin";
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const curPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);

  const [searchText, setSearchText] = useState("");
  const deferredQuery = useDeferredValue(searchText);

  const filteredTasks = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();

    if (!query) return tasks;

    return tasks.filter((task) => {
      const haystack = [
        task?.title,
        task?.description,
        task?.status,
        task?.priority,
        task?.category?.name,
        task?.assignedTo?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [tasks, deferredQuery]);

  useLayoutEffect(() => {
    if (!currentUser) {
      setIsAuthReady(false);
      return;
    }

    setIsAuthReady(true);
  }, [currentUser]);

  useEffect(() => {
    if (!isAuthReady) return;

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
  }, [isAuthReady, currentUser?.role]);

  useEffect(() => {
    if (!isAuthReady) return;

    const controller = new AbortController();
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        let nTasks = [];
        let nTotalPages = 1;

        if (isAdmin) {
          const res = await getTasks(deferredQuery, curPage, controller.signal);
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
        if (err.name === "AbortError" || err.name == "CanceledError") {
          return; // Ignore cancelled requests
        }
        console.error(err);
        setTasks([]);
        setError("Unable to load tasks right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    return () => controller.abort();
  }, [isAuthReady, reloadKey, curPage, currentUser?.role, deferredQuery]);

  const handleAdd = useCallback(() => {
    setSelectedTask(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((task) => {
    setSelectedTask(task);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((task) => {
    setSelectedTask(task);
    setisDeleteModalOpen(true);
  }, []);

  const handleChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const triggerReload = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(selectedTask._id);
      toast.success("Successfully Deleted a task!!");
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
        // setTasks((prev) =>
        //   prev.map((task) =>
        //     task._id === updatedTask._id ? updatedTask : task,
        //   ),
        // );
      } else {
        console.log("Create Task", taskData);
        const newTask = await createTask(taskData);
        setTasks((prev) => [...prev, newTask]);
      }

      triggerReload();
    } catch (err) {
      console.error(err);
      setError("Unable to save task right now.");
    }
  };

  // useEffect(() => {
  //   const search = async () => {
  //     try {
  //       // setLoading(true);
  //       let similarTasks = [];

  //       if (deferredQuery.length) {
  //         similarTasks = await searchMovie(deferredQuery);
  //       }

  //       setTasks(similarTasks);
  //     } catch (exception) {
  //       // setShowError(true);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   search();
  // }, [deferredQuery]);

  return (
    <section className="users-section">
      <div className="modal-header">
        <h2>Tasks</h2>
        {isAdmin && (
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleAdd} className="btn-primary">
              Add Task
            </Button>
          </div>
        )}
      </div>
      {isAdmin && (
        <div className="search-container" style={{ textAlign: "centre" }}>
          <Input
            label="Search"
            onChange={handleChange}
            value={searchText}
          ></Input>
        </div>
      )}
      <div className="users-grid" style={{ minHeight: "180px" }}>
        {!isAuthReady && <p>Preparing your tasks...</p>}
        {isAuthReady && loading && <p>Loading tasks...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && filteredTasks?.length === 0 && (
          <p>No tasks available.</p>
        )}

        {filteredTasks.map((task) => (
          <Card
            key={task._id}
            className="cd-card"
            title={task.title}
            actions={
              isAdmin
                ? [
                    <Button
                      key="edit"
                      onClick={() => handleEdit(task)}
                      className="edit-btn"
                    >
                      ✏️
                    </Button>,
                    <Button
                      key="delete"
                      onClick={() => handleDelete(task)}
                      className="delete-btn"
                    >
                      🗑️
                    </Button>,
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
          <Button
            // onClick={() => setCurPage((p) => p - 1)}
            onClick={() => setSearchParams({ page: curPage - 1 })}
            disabled={curPage === 1}
            className="btn-secondary"
          >
            Prev
          </Button>
          <Button
            // onClick={() => setCurPage((p) => p + 1)}
            onClick={() => setSearchParams({ page: curPage + 1 })}
            disabled={curPage === totalPages}
            className="btn-secondary"
          >
            Next
          </Button>
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
