import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import TodoList from "./components/todo/TodoList";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./utils/PrivateRoute"; 
import PasswordRecovery from "./components/auth/PasswordRecovery";
import Footer from './components/common/Footer'
const App = () => {
  return (
    
    <Router> 
      <div className="container">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/todo" element={<PrivateRoute element={TodoList} />} />
        <Route path="/profile" element={<PrivateRoute element={Profile} />} />
      </Routes>
      </div>
      <Footer/>
    </Router>
  );
};

export default App;
