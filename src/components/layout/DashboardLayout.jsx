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
    <div className={`flex h-screen overflow-hidden${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        userRole={isAdmin ? "admin" : "member"}
      />

      <main
        className={`flex-1 overflow-auto p-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-amber-50 via-gray-100 to-primary-50"
        }`}
      >
        {/* This is where the child routes will be rendered */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
