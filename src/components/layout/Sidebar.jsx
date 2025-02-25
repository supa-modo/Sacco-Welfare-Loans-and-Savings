import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HiMiniUserGroup } from "react-icons/hi2";
import { MdOutlineLogout, MdSpaceDashboard } from "react-icons/md";
import { TbLayoutSidebar, TbLayoutSidebarFilled } from "react-icons/tb"; // Import the icons
import logo from "/logo.png";
import { useAuth } from "../../context/AuthContext";
import { PiUserBold, PiUserDuotone } from "react-icons/pi";

const Sidebar = ({ darkMode, toggleDarkMode, userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = {
    admin: [
      { name: "Dashboard", to: "/admin/dashboard", icon: MdSpaceDashboard },
      { name: "Members", to: "/admin/members", icon: HiMiniUserGroup },
      { name: "Loans", to: "/admin/loans", icon: DocumentTextIcon },
      { name: "Savings", to: "/admin/savings", icon: CurrencyDollarIcon },
      { name: "Reports", to: "/admin/reports", icon: ChartBarIcon },
      { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
    ],
    member: [
      { name: "Dashboard", to: "/member/dashboard", icon: MdSpaceDashboard },
      { name: "My Loans", to: "/member/loans", icon: DocumentTextIcon },
      { name: "My Savings", to: "/member/savings", icon: CurrencyDollarIcon },
      { name: "Settings", to: "/member/settings", icon: Cog6ToothIcon },
    ],
  };

  const links = navigation[userRole] || [];

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
      } relative`} // Added relative positioning
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute z-10 transition-all duration-300 px-1.5 rounded-br-lg 
          ${
            darkMode
              ? "text-gray-200 hover:bg-gray-700"
              : "text-gray-600 hover:bg-gray-200"
          }
          ${
            isCollapsed
              ? "top-2 left-1/2 -translate-x-1/2 py-1"
              : "-right-11 top-0 bg-white shadow-sm border-r border-b py-1"
          }`}
      >
        {isCollapsed ? (
          <TbLayoutSidebarFilled size={30} />
        ) : (
          <TbLayoutSidebar size={30} />
        )}
      </button>

      <div
        className={`${
          isCollapsed ? "h-30" : "h-20"
        }flex items-center justify-center relative`}
      >
        {isCollapsed ? (
          <div className="flex items-center justify-center mt-14">
            <img src={logo} alt="welfare logo" className="w-12 h-12" />
          </div>
        ) : (
          <div className="flex items-center">
            <img src={logo} alt="welfare logo" className="w-20 h-20" />
            <div>
              <h1
                className={`text-xl font-extrabold ${
                  darkMode ? "text-white" : "text-amber-700"
                }`}
              >
                Staff Sacco Welfare Name
              </h1>
            </div>
          </div>
        )}
      </div>

      <nav className="mt-8 px-2 flex flex-col h-[calc(100%-5rem)] justify-between">
        <div className="space-y-2">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2.5 text-base font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-primary text-white"
                      : "bg-primary text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-primary-100 hover:text-gray-700"
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <item.icon
                className={`flex-shrink-0 h-6 w-6 transition-colors duration-200 ${
                  !isCollapsed && "mr-4"
                } `}
                aria-hidden="true"
              />
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </div>

        {/*  User info section */}
        <div className="mb-2">
          {/* Dark Mode Toggle */}
          <div className="px-2 mb-4">
            <div
              className={`relative flex items-center p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700/50 text-gray-200"
                  : "bg-gray-100/50 text-gray-700"
              } transition-all duration-300 ease-in-out`}
            >
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between mr-3">
                  <span
                    className={`text-[0.9rem] font-bold font-nunito-sans transition-colors duration-300 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Switch {darkMode ? "Light" : "Dark"} Mode
                  </span>
                </div>
              )}
              <button
                onClick={toggleDarkMode}
                className={`relative ${
                  isCollapsed ? "w-10" : "w-12"
                } h-6 rounded-full flex items-center 
        transition-colors duration-300 focus:outline-none
        ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
                aria-label="Toggle Dark Mode"
              >
                <span
                  className={`absolute left-0.5 transform transition-transform duration-300 ease-in-out
          inline-flex items-center justify-center w-5 h-5 rounded-full
          ${
            darkMode ? "translate-x-6 bg-gray-900" : "translate-x-0 bg-white"
          } shadow-lg`}
                >
                  {darkMode ? (
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>

          <div
            className={`border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } py-4`}
          >
            {/* User info and logout */}
            <div className="px-2 pb-6">
              {!isCollapsed ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <PiUserDuotone className="h-6 w-6 mr-2 " />

                    <span className="text-[0.9rem] font-extrabold font-nunito-sans truncate w-32">
                      {user?.member?.name || user?.userEmail || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2.5 text-sm bg-red-500 text-white rounded hover:bg-primary-dark transition-colors duration-200"
                  >
                    <MdOutlineLogout className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center"
                  title="Logout"
                >
                  <MdOutlineLogout className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
