import React, { useState, useEffect } from "react";
import AddTaskButton from "./components/AddTaskButton";
import TaskForm from "./components/TaskForm";
import DisplayDating from "./components/DisplayDating";
import Task from "./components/Task";
import DeleteAllMessage from "./components/massages/DeleteAllMassage";
import { database, auth } from "../../firebaseConfig";
import { ref, set, push, onValue, remove, update } from "firebase/database";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";

const TodoContent = () => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [timedOutTasks, setTimedOutTasks] = useState([]);
  const tasksPerPage = 4;

  // Sorting function: incomplete first, then completed, timed-out last
  const sortTasks = (tasksArray) => {
    return tasksArray.sort((a, b) => {
      if (!a.isCompleted && b.isCompleted) return -1;
      if (a.isCompleted && !b.isCompleted) return 1;

      if (!a.isTimedOut && b.isTimedOut) return -1;
      if (a.isTimedOut && !b.isTimedOut) return 1;

      return a.duration - b.duration;
    });
  };

  // Fetch tasks from Firebase on component mount and page change
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(database, `users/${user.uid}/tasks`);
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tasksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            duration: calculateDuration(data[key].endDate, data[key].endTime),
            isTimedOut:
              calculateDuration(data[key].endDate, data[key].endTime) <= 0,
          }));

          const sortedTasks = sortTasks(tasksArray);
          setTasks(sortedTasks);

          if (currentPage > Math.ceil(sortedTasks.length / tasksPerPage)) {
            setCurrentPage(Math.ceil(sortedTasks.length / tasksPerPage));
          }
        }
      });
    }
  }, [currentPage]);

  const calculateDuration = (endDate, endTime) => {
    const end = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    return end - now; // Duration in milliseconds
  };

  const addTaskToDatabase = (task) => {
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(database, `users/${user.uid}/tasks`);
      const newTaskRef = push(tasksRef);
      set(newTaskRef, task);
    }
  };

  const handleAddTask = (newTask) => {
    addTaskToDatabase(newTask);
    setIsTaskFormOpen(false);
  };

  const handleCompleteTask = (taskId, isCompleted) => {
    const user = auth.currentUser;
    if (user) {
      const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`);
      update(taskRef, { completed: isCompleted }).then(() => {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: isCompleted,
                  isTimedOut:
                    calculateDuration(task.endDate, task.endTime) <= 0,
                }
              : task
          );

          return sortTasks(updatedTasks);
        });
      });
    }
  };

  const handleEditTask = (taskId) => {
    console.log(`Edit task with ID: ${taskId}`);
  };

  const handleDeleteTask = (taskId) => {
    const user = auth.currentUser;
    if (user) {
      const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`);
      remove(taskRef).then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        if (
          tasks.length - 1 < (currentPage - 1) * tasksPerPage &&
          currentPage > 1
        ) {
          setCurrentPage(currentPage - 1);
        }
      });
    }
  };

  const handleDeleteAllTimedOutTasks = async () => {
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(database, `users/${user.uid}/tasks`);
      onValue(tasksRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tasksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            duration: calculateDuration(data[key].endDate, data[key].endTime),
          }));

          const timeOutTasks = tasksArray.filter((task) => task.duration <= 0);
          if (timeOutTasks.length > 0) {
            setTimedOutTasks(timeOutTasks);
            setIsDeleteModalOpen(true);
          }
        }
      });
    }
  };

  const confirmDeleteAllTimedOutTasks = async () => {
    const user = auth.currentUser;
    if (user) {
      for (const task of timedOutTasks) {
        const taskRef = ref(database, `users/${user.uid}/tasks/${task.id}`);
        await remove(taskRef);
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => !timedOutTasks.some((t) => t.id === task.id))
      );
      setIsDeleteModalOpen(false);
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(tasks.length / tasksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4 mt-10 bg-slate-100 rounded-lg">
      <div className="lg:flex justify-between items-center">
        <DisplayDating />
        <div className="Task text-center mb-4">
          <div className="flex justify-center mt-4">
            <AddTaskButton onClick={() => setIsTaskFormOpen(true)} />
            <button
              onClick={handleDeleteAllTimedOutTasks}
              className="px-4 py-2 mx-2 bg-red-500 text-white rounded"
            >
              Delete All Time Out Tasks
            </button>
          </div>
          {tasks.length > 0 ? (
            <>
              <div className="md:grid md:grid-cols-2 gap-4 mt-4">
                {currentTasks.map((task) => (
                  <Task
                    key={task.id}
                    taskData={task}
                    onComplete={handleCompleteTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
                >
                  <GrLinkPrevious />
                </button>
                <span className="px-4 py-2 mx-2">
                  Page {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage === Math.ceil(tasks.length / tasksPerPage)
                  }
                  className="px-4 py-2 mx-2 bg-blue-500 text-white rounded"
                >
                  <GrLinkNext />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No Tasks</p>
          )}
        </div>
      </div>

      {isTaskFormOpen && (
        <TaskForm
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleAddTask}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteAllMessage
          onConfirm={confirmDeleteAllTimedOutTasks}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TodoContent;
