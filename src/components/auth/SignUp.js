import React, { useState } from "react";
import { auth, database } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Update the user's profile with the name
        updateProfile(user, { displayName: name })
          .then(() => {
            const userRef = ref(database, `users/${user.uid}`);
            set(userRef, {
              name,
              email,
            });
            navigate("/login"); // Redirect to login after successful sign-up
          })
          .catch((error) => {
            console.error("Profile Update Error:", error);
            setError("Failed to update profile. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Sign Up Error:", error);
        setError("Failed to sign up. Please try again.");
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-secondary">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border border-secondary rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-secondary rounded"
          required
        />
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-secondary rounded"
            required
          />
          <div
            className="absolute top-2 right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-secondary text-white p-2 rounded hover:bg-accent transition"
        >
          Sign Up
        </button>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-secondary hover:underline">
            Log In
          </a>
        </p>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
