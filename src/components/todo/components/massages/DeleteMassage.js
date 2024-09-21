import React from "react";

const DeleteMessage = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-4">Delete Task</h2>
        <p className="mb-6">Are you sure you want to delete this task?</p>
        <div className="flex justify-center gap-4">
          {/* Yes button */}
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Yes
          </button>
          {/* No button */}
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

export default DeleteMessage;
