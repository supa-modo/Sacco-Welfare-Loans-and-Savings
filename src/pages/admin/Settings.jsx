import React, { useState } from "react";
import CardSection from "../../components/common/CardSection";

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
    maximumLoanAmount: 50000,
    minimumCreditScore: 650,
    interestRate: 12,
    maximumRepaymentTerm: 36,
    latePaymentGracePeriod: 5,
    autoPayments: true,
  });

  const [savingsSettings, setSavingsSettings] = useState({
    targetAmount: 10000,
    monthlyContribution: 500,
    autoDeposit: true,
    reminderFrequency: "weekly",
    goalDate: "2025-12-31",
  });

  const [systemSettings, setSystemSettings] = useState({
    systemMaintenanceMode: false,
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

  const systemStatusCards = [
    {
      title: "System Version",
      value: "2.1.0",
      bgColor: "text-amber-600",
      icon: <CogIcon className="h-12 w-12 text-primary-500" />,
    },
    {
      title: "Active System Users",
      value: "2,547",
      bgColor: "text-blue-500",
      icon: <UserGroupIcon className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Last Updated",
      value: "2h ago",
      bgColor: "text-purple-500",
      icon: <CalendarIcon className="h-9 w-9 text-purple-500" />,
    },
  ];
  const loanTabCards = [
    {
      title: "Total Active Loans",
      value: "147",
      bgColor: "text-amber-600",
      icon: <BanknotesIcon className="h-12 w-12 text-primary-600" />,
    },
    {
      title: "Total Portfolio Amount",
      value: "$1.2M",
      bgColor: "text-blue-500",
      icon: <CreditCardIcon className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Average Interest Rate",
      value: `${loanSettings.interestRate}%`,
      bgColor: "text-yellow-600",
      icon: <ChartBarIcon className="h-9 w-9 text-yellow-600" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="space-y-8">
            <CardSection title="System Status" cards={systemStatusCards} />

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-nunito-sans font-extrabold text-primary-600 mb-4">
                System Preferences
              </h3>
              <div className="space-y-6 px-8">
                {Object.entries(systemSettings).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 border-b border-gray-200/70 last:border-0"
                  >
                    <div>
                      <p className="font-semibold font-sans text-gray-700 capitalize">
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
                          value ? "bg-primary-500" : "bg-gray-200"
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
            <CardSection title="Loans Overview" cards={loanTabCards} />

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-nunito-sans font-extrabold text-primary-600 mb-4">
                Loan Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(loanSettings).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="block font-bold font-nunito-sans text-gray-500 capitalize">
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
                          value ? "bg-primary-500" : "bg-gray-200"
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
                        className="block w-full rounded-lg border border-gray-300 py-2 px-4 font-bold text-amber-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <div className="bg-gradient-to-r from-gray-100 to-primary-50 rounded-xl p-8">
              <h3 className="text-xl font-nunito-sans font-extrabold text-primary-600 mb-4">
                Savings Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(savingsSettings).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gradient-to-br from-amber-50 via-gray-100 to-white py-5 px-8 rounded-xl border border-gray-300 p-4 shadow-md transition-shadow"
                  >
                    <label className="block text-[0.9rem] font-bold font-nunito-sans text-gray-600 capitalize mb-2">
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
                          value ? "bg-primary-500" : "bg-gray-300"
                        } relative inline-flex h-6 w-11 mt-2 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
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
                        className="block w-full rounded-lg border border-gray-300 py-2 mb-2 px-4 font-bold text-amber-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <div className="flex justify-center min-h-[calc(100vh-19rem)]">
            <p className="text-gray-500">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-4">
        <h1 className="text-3xl font-extrabold mb-8 text-amber-700">
          System Settings & Preferences
        </h1>
        <div className="bg-gray-200 rounded-3xl shadow-md overflow-hidden pb-10">
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
          <div className="px-8 pt-8">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
