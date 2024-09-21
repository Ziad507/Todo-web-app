import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database, auth } from "../../../firebaseConfig";

const TaskForm = ({ onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.length > 30) {
      setDescriptionError("Description cannot exceed 30 characters.");
      return;
    }

    const user = auth.currentUser;
    const startTime = new Date().toLocaleTimeString("en-US", { hour12: false });

    if (user) {
      const taskRef = ref(database, `users/${user.uid}/tasks`);
      await push(taskRef, {
        taskName,
        endDate,
        startTime,
        endTime,
        description,
        completed: false,
      });

      setTaskName("");
      setEndDate("");
      setEndTime("");
      setDescription("");
      setDescriptionError("");
      onClose();
    } else {
      console.error("No user is logged in.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Name"
              className="w-full p-2 border border-secondary rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-secondary rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-secondary rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description (max 30 characters)
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 30) {
                  setDescription(e.target.value);
                  setDescriptionError("");
                } else {
                  setDescriptionError(
                    "Description cannot exceed 30 characters."
                  );
                }
              }}
              placeholder="Description"
              className="w-full p-2 border border-secondary rounded"
              rows="4"
              maxLength="30"
              required
            />
            {descriptionError && (
              <p className="text-red-500">{descriptionError}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
