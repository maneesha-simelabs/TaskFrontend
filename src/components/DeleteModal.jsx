import { useEffect } from "react";
import "../css/DeleteModal.css";
import Button from "./Button";

function DeleteModal({ isDeleteModalOpen, onClose, onConfirm, taskTitle }) {
  useEffect(() => {
    document.body.style.overflow = isDeleteModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDeleteModalOpen]);

  if (!isDeleteModalOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="delete-modal">
        <h2>Delete Task?</h2>
        <p>
          {taskTitle
            ? `Are you sure you want to delete "${taskTitle}"?`
            : "This action cannot be undone."}
        </p>

        <div className="actions">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="delete" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
