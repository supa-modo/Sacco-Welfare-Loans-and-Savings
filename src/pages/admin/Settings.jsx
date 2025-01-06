import React, { useState } from "react";

import {
  ChartBarIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChevronRightIcon,
  UserGroupIcon,
  CalendarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    monthly: true,
    quarterly: true,
    loanUpdates: true,
    paymentReminders: true,
    marketingOffers: false,
  });

  const [loanSettings, setLoanSettings] = useState({
    maxLoanAmount: 50000,
    minCreditScore: 650,
    interestRate: 12,
    maxTerm: 36,
    autoPayments: true,
    latePaymentGracePeriod: 5,
    earlyPaymentDiscount: 2,
  });

  const [savingsSettings, setSavingsSettings] = useState({
    targetAmount: 10000,
    monthlyContribution: 500,
    autoDeposit: true,
    reminderFrequency: "weekly",
    goalDate: "2025-12-31",
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    backupFrequency: "daily",
    retentionDays: 30,
    darkMode: false,
    language: "English",
    timezone: "UTC-5",
  });

  const tabs = [
    { name: "General", icon: CogIcon },
    { name: "Notifications", icon: BellIcon },
    { name: "Security", icon: ShieldCheckIcon },
    { name: "Loans", icon: BanknotesIcon },
    { name: "Savings", icon: ChartBarIcon },
    { name: "Documents", icon: DocumentTextIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">System Version</p>
                      <p className="text-lg font-semibold text-gray-900">
                        2.1.0
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CogIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-lg font-semibold text-gray-900">
                        2,547
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-lg font-semibold text-gray-900">
                        2h ago
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                System Preferences
              </h3>
              <div className="space-y-6">
                {Object.entries(systemSettings).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {typeof value === "boolean"
                          ? `Currently ${value ? "enabled" : "disabled"}`
                          : `Set to: ${value}`}
                      </p>
                    </div>
                    {typeof value === "boolean" ? (
                      <button
                        onClick={() =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className={`${
                          value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            value ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                        />
                      </button>
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Loans":
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Loan Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Loans</p>
                      <p className="text-lg font-semibold text-gray-900">147</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BanknotesIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Portfolio</p>
                      <p className="text-lg font-semibold text-gray-900">
                        $1.2M
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CreditCardIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Avg Interest Rate</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {loanSettings.interestRate}%
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Loan Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(loanSettings).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {typeof value === "boolean" ? (
                      <button
                        onClick={() =>
                          setLoanSettings((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className={`${
                          value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            value ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                        />
                      </button>
                    ) : (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          setLoanSettings((prev) => ({
                            ...prev,
                            [key]: Number(e.target.value),
                          }))
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Savings":
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Savings Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(savingsSettings).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {typeof value === "boolean" ? (
                      <button
                        onClick={() =>
                          setSavingsSettings((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className={`${
                          value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            value ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                        />
                      </button>
                    ) : (
                      <input
                        type={key.includes("date") ? "date" : "text"}
                        value={value}
                        onChange={(e) =>
                          setSavingsSettings((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {value ? "Currently enabled" : "Currently disabled"}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className={`${
                          value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                      >
                        <span
                          className={`${
                            value ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-extrabold mb-8 text-amber-700">
          System Settings & Preferences
        </h1>
        <div className="bg-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="">
              <nav
                className=" flex bg-primary-500 overflow-x-auto"
                aria-label="Tabs"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`${
                        activeTab === tab.name
                          ? "border-amber-100 text-amber-100"
                          : "border-transparent text-white hover:border-gray-600 hover:text-gray-700"
                      } font-nunito-sans  whitespace-nowrap py-6 border-b-[4px] font-extrabold transition-colors duration-200`}
                    >
                      <div className="flex items-center px-8">
                        <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span className="">{tab.name}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
