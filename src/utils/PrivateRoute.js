import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Simplified check
      setLoading(false);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner
  }

  // If user is not authenticated, redirect to login
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
