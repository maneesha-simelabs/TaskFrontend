import React from "react";

function DeleteModal() {
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
