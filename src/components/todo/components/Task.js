import React, { useState, useEffect } from "react";
import { MdCheckCircle, MdEdit, MdDelete } from "react-icons/md";
import { differenceInMinutes, isBefore } from "date-fns";
import UpdateTaskMessage from "./massages/UpdateMassage";
import DeleteTaskMessage from "./massages/DeleteMassage";
import CompleteMessage from "./massages/CompleteMessage"; // Import the CompleteMessage component
import { database, auth } from "../../../firebaseConfig";
import { ref, remove, update } from "firebase/database";

const Task = ({ taskData, onComplete, onDelete, onEdit }) => {
  const [duration, setDuration] = useState("");
  const [isCompleted, setIsCompleted] = useState(taskData.completed);
  const [isTimeout, setIsTimeout] = useState(false); // New state to track if task has timed out
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false); // State for the CompleteMessage modal
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [editedTaskName, setEditedTaskName] = useState(taskData.taskName);
  const [editedEndTime, setEditedEndTime] = useState(taskData.endTime);
  const [editedEndDate, setEditedEndDate] = useState(taskData.endDate);
  const [editedDescription, setEditedDescription] = useState(
    taskData.description
  );

  useEffect(() => {
    const intervalId = setInterval(calculateDuration, 60000);
    calculateDuration();

    return () => clearInterval(intervalId);
  }, [taskData]);

  const calculateDuration = () => {
    // If the task is completed, set duration to "Done"
    if (isCompleted) {
      setDuration("Done");
      return;
    }

    // Otherwise, calculate the remaining time
    const now = new Date();
    const [endHour, endMinute] = taskData.endTime.split(":");
    const endDateTime = new Date(taskData.endDate);
    endDateTime.setHours(endHour);
    endDateTime.setMinutes(endMinute);

    // Check if the task has timed out
    if (isBefore(endDateTime, now)) {
      setDuration("Time out");
      setIsTimeout(true); // Set timeout state to true
      return;
    }

    // Calculate the remaining duration in days, hours, and minutes
    const timeDifference = differenceInMinutes(endDateTime, now);
    const hoursLeft = Math.floor(timeDifference / 60);
    const minutesLeft = timeDifference % 60;
    const daysLeft = Math.floor(timeDifference / (60 * 24));

    // Update the duration state with the remaining time
    setDuration(`${daysLeft}d : ${hoursLeft}h : ${minutesLeft}m left`);
  };

  const handleComplete = () => {
    setIsCompleteModalOpen(true); // Open the CompleteMessage modal
  };

  const handleCompleteConfirm = async () => {
    const newCompletedStatus = true; // Always set to completed
    setIsCompleted(newCompletedStatus);
    onComplete(taskData.id, newCompletedStatus); // Pass the updated status

    try {
      // Persist the completion status in Firebase
      const taskRef = ref(
        database,
        `users/${auth.currentUser.uid}/tasks/${taskData.id}`
      );
      await update(taskRef, { completed: newCompletedStatus });
    } catch (error) {
      console.error("Error updating task completion:", error);
    }

    setIsCompleteModalOpen(false); // Close the CompleteMessage modal
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleUpdateTask = () => {
    setIsUpdateModalOpen(true);
  };

  const confirmUpdateTask = async () => {
    try {
      const taskRef = ref(
        database,
        `users/${auth.currentUser.uid}/tasks/${taskData.id}`
      );
      await update(taskRef, {
        taskName: editedTaskName,
        endTime: editedEndTime,
        endDate: editedEndDate,
        description: editedDescription,
      });
      onEdit(taskData.id);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setIsUpdateModalOpen(false);
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex justify-between items-center mb-4 ${
        isCompleted ? "bg-green-400" : isTimeout ? "bg-red-400" : "bg-secondary"
      }`}
    >
      <div>
        {!isEditing ? (
          <>
            <h3 className="text-xl text-white font-semibold">
              {taskData.taskName}
            </h3>
            <p className="text-white text-sm mt-1">
              Description:{" "}
              {isDescriptionExpanded
                ? taskData.description
                : taskData.description.slice(0, 10) +
                  (taskData.description.length > 10 ? "..." : "")}
              {taskData.description.length > 10 && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="text-blue-400 ml-2"
                >
                  {isDescriptionExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </p>
            <p className="text-sm text-white mt-1">
              Start Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-white text-sm mt-1">
              {isTimeout
                ? "Time out"
                : isCompleted
                ? "Done"
                : `Duration: ${duration}`}
            </p>
          </>
        ) : (
          <div>
            <input
              className="text-xl text-white bg-transparent border-b-2"
              value={editedTaskName}
              onChange={(e) => setEditedTaskName(e.target.value)}
              placeholder="Task Name"
            />
            <div className="mt-2">
              <label className="text-sm text-white">Description: </label>
              <textarea
                className="bg-transparent border-b-2 text-white"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={2}
                maxLength={30}
                placeholder="Description (max 30 characters)"
              />
            </div>
            <div className="mt-2">
              <label className="text-sm text-white">End Date: </label>
              <input
                className="bg-transparent border-b-2 text-white"
                type="date"
                value={editedEndDate}
                onChange={(e) => setEditedEndDate(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="text-sm text-white">End Time: </label>
              <input
                className="bg-transparent border-b-2 text-white"
                type="time"
                value={editedEndTime}
                onChange={(e) => setEditedEndTime(e.target.value)}
              />
            </div>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded"
              onClick={handleUpdateTask}
            >
              Update Task
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isTimeout && !isCompleted && (
          <button
            onClick={handleComplete}
            className="text-white text-2xl hover:text-green-400"
          >
            <MdCheckCircle />
          </button>
        )}
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-white text-2xl hover:text-yellow-400"
          >
            <MdEdit />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-white text-2xl hover:text-red-600"
        >
          <MdDelete />
        </button>
      </div>

      {isUpdateModalOpen && (
        <UpdateTaskMessage
          onConfirm={confirmUpdateTask}
          onCancel={() => setIsUpdateModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTaskMessage
          onConfirm={() => {
            onDelete(taskData.id);
            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      {isCompleteModalOpen && (
        <CompleteMessage
          onConfirm={handleCompleteConfirm}
          onCancel={() => setIsCompleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Task;
