import { useState } from "react";
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    monthly: true,
    quarterly: true,
  });

  const [loanSettings, setLoanSettings] = useState({
    maxLoanAmount: 50000,
    minCreditScore: 650,
    interestRate: 12,
    maxTerm: 36,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    backupFrequency: "daily",
    retentionDays: 30,
  });

  const tabs = [
    { name: "General", icon: CogIcon },
    { name: "Notifications", icon: BellIcon },
    { name: "Security", icon: ShieldCheckIcon },
    { name: "Loans", icon: BanknotesIcon },
    { name: "Documents", icon: DocumentTextIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 ">
                System Information
              </h3>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-whitep-4 rounded-lg border border-gray-200 ">
                    <p className="text-sm text-gray-500 ">Version</p>
                    <p className="text-lg font-medium text-gray-900 ">1.0.0</p>
                  </div>
                  <div className="bg-white  p-4 rounded-lg border border-gray-200 ">
                    <p className="text-sm text-gray-500 ">Last Updated</p>
                    <p className="text-lg font-medium text-gray-900 ">
                      Jan 5, 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 ">
                System Settings
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 ">
                      Maintenance Mode
                    </p>
                    <p className="text-sm text-gray-500 ">
                      Put the system in maintenance mode
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        maintenanceMode: !prev.maintenanceMode,
                      }))
                    }
                    className={`${
                      systemSettings.maintenanceMode
                        ? "bg-primary"
                        : "bg-gray-200 "
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        systemSettings.maintenanceMode
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 ">
                      Debug Mode
                    </p>
                    <p className="text-sm text-gray-500 ">
                      Enable detailed error logging
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        debugMode: !prev.debugMode,
                      }))
                    }
                    className={`${
                      systemSettings.debugMode ? "bg-primary" : "bg-gray-200 "
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        systemSettings.debugMode
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 ">
              Notification Preferences
            </h3>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900  capitalize">
                    {key} Notifications
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className={`${
                    value ? "bg-primary" : "bg-gray-200 "
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      value ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                  />
                </button>
              </div>
            ))}
          </div>
        );
      case "Loans":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 ">
              Loan Settings
            </h3>
            {Object.entries(loanSettings).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700  capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setLoanSettings((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value),
                    }))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm "
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white  shadow rounded-lg">
        <div className="border-b border-gray-200 ">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`${
                    activeTab === tab.name
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 "
                  } flex items-center px-1 py-4 border-b-2 font-medium text-sm`}
                >
                  <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
