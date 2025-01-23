import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ isAdmin }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        userRole={isAdmin ? "admin" : "member"}
      />

      <main
        className={`flex-1 overflow-auto p-8 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
        }`}
      >
        {/* This is where the child routes will be rendered */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
