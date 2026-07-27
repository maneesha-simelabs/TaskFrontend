import { useEffect, useState } from "react";
import "../css/TaskModal.css";
import "../css/Login.css";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Todo",
  category: "",
  dueDate: "",
  assignedTo: "",
};

export default function TaskModal({
  isOpen,
  users,
  categories,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        status: initialData.status,
        dueDate: initialData.dueDate?.split("T")[0],
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo,
        category: initialData?.category?._id || initialData.category,
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
    const nextForm = {
      ...form,
      [e.target.name]: e.target.value,
    };

    setForm(nextForm);
    validate(nextForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate(form);
    if (!isValid) {
      setHasError(true);
      return;
    }

    setHasError(false);
    onSave(form);
    onClose();
  };

  const validateRequired = (value, fieldName) => {
    return value?.trim() ? "" : `${fieldName} is `;
  };

  const validate = (currentForm = form) => {
    const newErrors = {};

    newErrors.title = validateRequired(currentForm.title, "Title");
    newErrors.description = validateRequired(
      currentForm.description,
      "Description",
    );
    newErrors.category = validateRequired(currentForm.category, "Category");
    newErrors.priority = validateRequired(currentForm.priority, "Priority");
    newErrors.status = validateRequired(currentForm.status, "Status");
    newErrors.assignedTo = validateRequired(
      currentForm.assignedTo,
      "Assigned To",
    );
    newErrors.dueDate = validateRequired(currentForm.dueDate, "Due date");

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    const hasError = Object.keys(newErrors).length !== 0;
    setHasError(hasError);
    return !hasError;
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
          <label>
            Title<span className="required-star">*</span>
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? "error-input" : ""}
          />

          <label>
            Description<span className="required-star">*</span>
          </label>

          <textarea
            rows="4"
            name="description"
            value={form.description}
            className={errors.description ? "error-input" : ""}
            onChange={handleChange}
          />

          <label>
            Priority<span className="required-star">*</span>
          </label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={errors.priority ? "error-input" : ""}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <label>
            Status<span className="required-star">*</span>
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={errors.status ? "error-input" : ""}
          >
            <option>
              Todo<span className="required-star">*</span>
            </option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <label>Due Date</label>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            className={errors.dueDate ? "error-input" : ""}
            onChange={handleChange}
          />
          <label>
            Assign To<span className="required-star">*</span>
          </label>

          <select
            name="assignedTo"
            value={form.assignedTo}
            className={errors.assignedTo ? "error-input" : ""}
            onChange={handleChange}
          >
            <option value="">Select User</option>

            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <label>
            Category<span className="required-star">*</span>
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? "error-input" : ""}
          >
            <option value="">Select Category</option>

            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {hasError && <p className="error">Please fill required fields!!</p>}
          <div className="actions modal-footer">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>

            <button className="save" disabled={hasError}>
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
