import React from "react";

const LogoutButton = ({ handleLogout }) => {
  return (
    <button
      onClick={handleLogout}
      aria-label="Log out"
      className="mb-4 bg-secondary text-white px-4 py-2 rounded hover:bg-accent hover:text-white transition ease-out max-md:px-2 max-md:py-1"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
