import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/todo");
      }
    });
    return () => unsubscribe(); // Clean up subscription on component unmount
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/todo");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            setError("Invalid email address format.");
            break;
          case "auth/user-disabled":
            setError("This user account has been disabled.");
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setError("Wrong email or password. Please try again.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-secondary">Login</h2>
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
          Login
        </button>
        <p className="mt-4 text-sm">
          <a
            href="/password-recovery"
            className="text-secondary hover:underline"
          >
            Forgot your password?
          </a>
        </p>
        <p className="mt-2 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-secondary hover:underline">
            Sign Up
          </a>
        </p>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
