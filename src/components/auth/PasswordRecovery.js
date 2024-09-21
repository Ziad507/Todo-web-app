import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Password reset email sent!");
      })
      .catch((error) => {
        setError("Failed to send reset email. Please try again.");
        console.error(error.message); // Log detailed error for debugging
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <form
        onSubmit={handlePasswordReset}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-secondary">
          Password Recovery
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-secondary rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-secondary text-white p-2 rounded hover:bg-accent transition"
        >
          Send Password Reset Email
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default PasswordRecovery;
