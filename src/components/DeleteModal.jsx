import React from "react";
import { useEffect } from "react";

function DeleteModal({ isDeleteModalOpen }) {
  useEffect(() => {
    document.body.style.overflow = isDeleteModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDeleteModalOpen]);

  if (!isDeleteModalOpen) return null;
  return (
    <div>
      DeleteModal
      <div className="delete-modal">
        <h2>Delete Task?</h2>

        <p>This action cannot be undone.</p>

        <div className="actions">
          <button>Cancel</button>

          <button className="delete">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
