import React, { useState } from "react";
import {
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import GeneralTab from "../../components/settings/GeneralTab";
import NotificationsTab from "../../components/settings/NotificationsTab";
import SecurityTab from "../../components/settings/SecurityTab";
import LoansTab from "../../components/settings/LoansTab";
import SavingsTab from "../../components/settings/SavingsTab";

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <GeneralTab
            systemSettings={systemSettings}
            setSystemSettings={setSystemSettings}
          />
        );
      case "Notifications":
        return (
          <NotificationsTab
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case "Security":
        return <SecurityTab />;
      case "Loans":
        return (
          <LoansTab
            loanSettings={loanSettings}
            setLoanSettings={setLoanSettings}
          />
        );
      case "Savings":
        return (
          <SavingsTab
            savingsSettings={savingsSettings}
            setSavingsSettings={setSavingsSettings}
          />
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
                className="flex bg-primary-500 overflow-x-auto"
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
                      } font-nunito-sans whitespace-nowrap py-6 border-b-[4px] font-extrabold transition-colors duration-200`}
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
