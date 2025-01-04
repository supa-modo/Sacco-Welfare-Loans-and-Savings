// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex-1 flex items-center">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="h-6 w-6" />
            {notifications.some((n) => n.unread) && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 ${
                      notification.unread ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleIcon className="h-7 w-7 text-gray-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                <span>Profile</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <MdLogout className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
