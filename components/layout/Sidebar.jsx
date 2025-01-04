import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  InboxIcon,
  BanknotesIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isAdmin }) => {
  const location = useLocation();

  const memberMenuItems = [
    { name: "Home", icon: HomeIcon, path: "/dashboard" },
    { name: "Payments", icon: BanknotesIcon, path: "/payments" },
    { name: "Maintenance", icon: CogIcon, path: "/maintenance" },
    { name: "Inbox", icon: InboxIcon, path: "/inbox" },
  ];

  const memberDataItems = [
    { name: "Properties", icon: HomeIcon, path: "/properties" },
    { name: "Tenants", icon: UsersIcon, path: "/tenants" },
    { name: "Transactions", icon: DocumentTextIcon, path: "/transactions" },
    { name: "Finance", icon: BanknotesIcon, path: "/finance" },
    { name: "Commissions", icon: CreditCardIcon, path: "/commissions" },
    { name: "Reports", icon: ClipboardDocumentListIcon, path: "/reports" },
  ];

  const adminMenuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/admin/dashboard" },
    { name: "Members", icon: UserGroupIcon, path: "/admin/members" },
    { name: "Loans", icon: CreditCardIcon, path: "/admin/loans" },
    { name: "Transactions", icon: DocumentTextIcon, path: "/admin/transactions" },
    { name: "Reports", icon: ChartBarIcon, path: "/admin/reports" },
    { name: "Settings", icon: CogIcon, path: "/admin/settings" },
  ];

  const menuItems = isAdmin ? adminMenuItems : memberMenuItems;
  const dataItems = !isAdmin ? memberDataItems : [];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">SACCO</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            MENU
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm space-x-3 
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {!isAdmin && (
          <div className="px-3 py-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              DATA
            </div>
            <div className="space-y-1">
              {dataItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm space-x-3 
                      ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
