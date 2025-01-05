// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      text: "Your loan application has been approved",
      time: "5m ago",
      unread: true,
    },
    { id: 2, text: "New payment received", time: "1h ago", unread: true },
    {
      id: 3,
      text: "Account statement available",
      time: "2h ago",
      unread: false,
    },
  ];

  return (
    <header className={`h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-4`}>
      <div className="flex-1 flex items-center">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className={`block w-full pl-10 pr-4 py-2 border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-200 text-gray-900 placeholder-gray-500'
            } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-1 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 ${notification.unread ? 'bg-primary/5' : ''} ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {notification.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <UserCircleIcon className="h-6 w-6" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
              {user?.name || 'User'}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 text-sm ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                } flex items-center space-x-2`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
