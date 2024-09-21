import React, { useState, useEffect } from "react";
import { database, auth } from "../../firebaseConfig";
import { ref, update, onValue } from "firebase/database";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Profile = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState(""); // Email will just be displayed, not updated
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // For reauthentication
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State for current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(database, `users/${user.uid}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserName(data.name || "");
          setEmail(user.email || ""); // Just display the email
        }
      });
    }
  }, []);

  const handleUpdateProfile = () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(database, `users/${user.uid}`);

      // Update the user's name in the database
      update(userRef, { name: userName })
        .then(() => {
          setSuccess("Profile updated successfully!");

          // If a new password is provided, update it
          if (password) {
            const credential = EmailAuthProvider.credential(
              user.email,
              currentPassword
            );

            reauthenticateWithCredential(user, credential)
              .then(() => {
                updatePassword(user, password)
                  .then(() => {
                    setSuccess("Password updated successfully!");
                  })
                  .catch((error) => {
                    setError(`Error updating password: ${error.message}`);
                  });
              })
              .catch((error) => {
                setError(`Error reauthenticating user: ${error.message}`);
              });
          }
        })
        .catch((error) => {
          setError(`Error updating profile: ${error.message}`);
        });
    }
  };

  return (
    <div className="container p-8">
      <h2 className="text-secondary text-lg font-semibold">Update Profile</h2>
      <div className="flex flex-col items-center mb-8">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Update your name"
          className="w-full p-2 mb-4 border border-secondary rounded"
        />
        <input
          type="email"
          value={email}
          readOnly // Prevents the email from being edited
          placeholder="Your email"
          className="w-full p-2 mb-4 border border-secondary rounded bg-gray-100"
        />
        <div className="relative w-full mb-4">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full p-2 border border-secondary rounded"
          />
          <div
            className="absolute top-2 right-3 cursor-pointer"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <div className="relative w-full mb-4">
          <input
            type={showNewPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New password"
            className="w-full p-2 border border-secondary rounded"
          />
          <div
            className="absolute top-2 right-3 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <button
          onClick={handleUpdateProfile}
          className="bg-secondary text-white p-2 rounded hover:bg-accent transition"
        >
          Update Profile
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;
