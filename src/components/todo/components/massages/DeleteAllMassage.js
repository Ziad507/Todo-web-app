import React from "react";

const DeleteAllMessage = ({ onConfirm, onCancel }) => {
  return (
    <div
      role="dialog"
      aria-labelledby="delete-tasks-dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 id="delete-tasks-dialog" className="text-lg font-semibold mb-4">
          Delete Tasks
        </h2>
        <p className="mb-6">
          Are you sure you want to delete all timed-out tasks?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllMessage;
