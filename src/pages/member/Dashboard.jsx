import {
  CreditCardIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const MemberDashboard = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-8">
          {/* Payment Statistics */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-semibold text-gray-800 ${
                  darkMode ? "text-red-500" : "text-gray-800"
                }`}
              >
                Payment statistics
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span>Last 7 days</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Savings</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      $12,500
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-500 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Loans</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      2
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-500">No change</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Next Payment</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      $450
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-yellow-500 font-medium">
                    Due in 5 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
              Billing history
            </h2>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div>Member</div>
                <div>Invoice</div>
                <div>Property address</div>
                <div>Due date</div>
              </div>
              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 p-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                      <span className="font-medium text-gray-900">
                        John Doe
                      </span>
                    </div>
                    <div className="text-gray-500">#0000{i}8596</div>
                    <div className="text-gray-500">
                      123 Main St, City, State
                    </div>
                    <div className="text-gray-500">Jan {i + 7}, 2024</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
