import React from "react";
import { MdCheckCircle, MdCancel } from "react-icons/md";

const CompleteMessage = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-4">Complete Task</h3>
        <p className="mb-4">
          Are you sure you want to mark this task as completed?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          >
            <MdCheckCircle /> Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <MdCancel /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteMessage;
