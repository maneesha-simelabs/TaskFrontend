import { useEffect, useState } from "react";
import "../css/TaskModal.css";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Todo",
  dueDate: "",
  assignedTo: "",
};

export default function TaskModal({
  isOpen,
  users,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        status: initialData.status,
        dueDate: initialData.dueDate?.split("T")[0],
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo,
      });
    } else {
      setForm(initialForm);
    }
  }, [initialData]);
  //   useEffect(() => {
  //     if (initialData) {
  //       setForm(initialData);
  //     } else {
  //       setForm(initialForm);
  //     }
  //   }, [initialData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(form);

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div style={{ fontSize: "x-large" }}>
            {initialData ? "Edit Task" : "Add Task"}
          </div>

          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Title</label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>

          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Priority</label>

          <select name="priority" value={form.priority} onChange={handleChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <label>Status</label>

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <label>Due Date</label>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
          <label>Assign To</label>

          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
          >
            <option value="">Select User</option>

            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <div className="actions modal-footer">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>

            <button className="save">
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
