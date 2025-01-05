import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ darkMode, userRole }) => {
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

  return (
    <div
      className={`w-64 transition-colors duration-200 ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-r border-gray-700"
          : "bg-white text-gray-600 border-r border-gray-200"
      }`}
    >
      <div className="h-16 flex items-center justify-center">
        <h1
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          SACCO Welfare
        </h1>
      </div>

      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-gray-900 text-white"
                      : "bg-primary text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon
                className={`mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-200 ${
                  darkMode ? "text-gray-300" : "text-gray-400"
                } group-hover:text-gray-300`}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
