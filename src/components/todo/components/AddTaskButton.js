import React from "react";
import { FaPlus } from "react-icons/fa"; // Import add icon from React Icons

const AddTaskButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-white p-2 rounded hover:bg-accent transition flex items-center"
    >
      <FaPlus className="mr-2" /> Add Task
    </button>
  );
};

export default AddTaskButton;
