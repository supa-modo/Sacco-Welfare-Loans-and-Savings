import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { MdOutlineLogout } from "react-icons/md";
import logo from "/logo.png";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ darkMode, userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = {
    admin: [
      { name: "Dashboard", to: "/admin/dashboard", icon: HomeIcon },
      { name: "Members", to: "/admin/members", icon: UserGroupIcon },
      { name: "Loans", to: "/admin/loans", icon: DocumentTextIcon },
      { name: "Savings", to: "/admin/savings", icon: CurrencyDollarIcon },
      { name: "Reports", to: "/admin/reports", icon: ChartBarIcon },
      { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
    ],
    member: [
      { name: "Dashboard", to: "/member/dashboard", icon: HomeIcon },
      { name: "My Loans", to: "/member/loans", icon: DocumentTextIcon },
      { name: "My Savings", to: "/member/savings", icon: CurrencyDollarIcon },
      { name: "Settings", to: "/member/settings", icon: Cog6ToothIcon },
    ],
  };

  const links = navigation[userRole] || [];
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300 ease-in-out ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-r border-gray-700"
          : "bg-white text-gray-600 border-r border-gray-200"
      }`}
    >
      <div className="h-20 flex items-center justify-center relative">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-14 bg-primary text-white rounded-md p-1 hover:bg-primary-dark transition-colors duration-200 ${
            darkMode ? "hover:bg-gray-600" : ""
          }`}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-7 w-4" />
          ) : (
            <ChevronLeftIcon className="h-7 w-4" />
          )}
        </button>
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <img src={logo} alt="welfare logo" className="w-10 h-10" />
          </div>
        ) : (
          <div className="flex items-center">
            <img src={logo} alt="welfare logo" className="w-20 h-20" />
            <div>
              <h1
                className={`text-xl font-extrabold ${
                  darkMode ? "text-white" : "text-primary"
                }`}
              >
                Staff Sacco Welfare Name
              </h1>
            </div>
          </div>
        )}
      </div>

      <nav className="mt-5 px-2 flex flex-col h-[calc(100%-5rem)] justify-between">
        <div className="space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-primary text-white"
                      : "bg-primary text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-primary-100 hover:text-gray-900"
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <item.icon
                className={`flex-shrink-0 h-6 w-6 transition-colors duration-200 ${
                  !isCollapsed && "mr-4"
                } ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } group-hover:text-gray-600`}
                aria-hidden="true"
              />
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </div>

        {/* User info and logout section */}
        <div
          className={`border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } py-4`}
        >
          <div className="px-2 pb-6">
            {!isCollapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 mr-2" />
                  <span className="text-sm font-bold truncate w-24">
                    John Doe Lorem Ipsum Kale
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-primary-dark transition-colors duration-200"
                >
                  <MdOutlineLogout className="h-4 w-4 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                // onClick={handleLogout}
                className="w-full flex justify-center"
                title="Logout"
              >
                <UserIcon className="h-6 w-6 " />
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
