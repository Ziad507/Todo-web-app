import React, { useState, useEffect } from "react";
import { database, auth } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";
import Modal from "../common/Modal";
import Profile from "../profile/Profile";
import { MdEditSquare } from "react-icons/md";
import TodoContent from "./TodoContent";


const TodoList = () => {
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(database, `users/${user.uid}`);

      onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserName(data.name || ""); // Set default empty string if data.name is undefined
          } else {
            console.log("No user data found");
          }
        },
        {
          onlyOnce: true, // Fetch the data once
        }
      );
    } else {
      console.log("No authenticated user found");
    }
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="container min-h-screen bg-primary dark:bg-gray-900 text-secondary dark:text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col items-center mb-8">
          {/* Display the user's name */}
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl max-md:text-xl font-bold">
              Welcome, {userName}
            </h2>
            <div className="bg-secondary dark:bg-gray-700 rounded-full text-white hover:text-secondary max-md:w-6 max-md:h-6 w-8 h-8 text-center hover:bg-slate-200 duration-200 ease-out">
              <MdEditSquare
                onClick={() => setIsModalOpen(true)} // Open modal on click
                className="text-2xl cursor-pointer md:mt-1 max-md:w-4 w-5 ml-1"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          
          <LogoutButton handleLogout={handleLogout} />
        </div>
      </div>

      {/* Modal for profile information */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Profile onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="text-center">
        <WelcomeMessage userName={userName} />
      </div>
      <TodoContent />
    </div>
  );
};

function WelcomeMessage({ userName }) {
  return (
    <h1 className="font-robotoFlex font-bold text-2xl md:text-3xl">
      Hello, {userName},{" "}
      <span className="text-[#63605F] dark:text-gray-400">
        Start planning today
      </span>
    </h1>
  );
}

export default TodoList;
