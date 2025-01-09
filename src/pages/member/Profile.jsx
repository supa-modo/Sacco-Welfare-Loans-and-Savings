import React, { useState } from "react";
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  StarIcon,
  ChartBarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const MemberSettings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [settings, setSettings] = useState({
    profile: {
      emailNotifications: true,
      phoneNotifications: false,
      twoFactorAuth: true,
      newsletter: true,
      darkMode: false,
      language: "English",
      timezone: "UTC-5",
    },
    privacy: {
      showProfilePublicly: true,
      showActivityHistory: true,
      allowMessageFromMembers: true,
      showFinancialDetails: false,
    },
    preferences: {
      autoPayEnabled: true,
      paymentReminders: true,
      minimumPaymentAlert: true,
      monthlyStatements: true,
      paperlessBilling: true,
      investmentUpdates: true,
    },
  });

  const tabs = [
    { name: "Profile", icon: UserIcon },
    { name: "Privacy", icon: ShieldCheckIcon },
    { name: "Preferences", icon: StarIcon },
    { name: "Billing", icon: CreditCardIcon },
    { name: "Documents", icon: DocumentTextIcon },
  ];

  const renderToggle = (section, key, value) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        <p className="font-semibold text-gray-800 capitalize">
          {key.replace(/([A-Z])/g, " $1").trim()}
        </p>
        <p className="text-sm text-gray-500">
          {value ? "Enabled" : "Disabled"}
        </p>
      </div>
      <button
        onClick={() =>
          setSettings((prev) => ({
            ...prev,
            [section]: {
              ...prev[section],
              [key]: !value,
            },
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
    </div>
  );

  const renderTabContent = () => {
    const sectionKey = activeTab.toLowerCase();

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {activeTab} Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings[sectionKey] || {}).map(([key, value]) =>
              renderToggle(sectionKey, key, value)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-amber-700">
            Account Settings
          </h1>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200">
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <nav className="flex bg-primary-500 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`${
                    activeTab === tab.name
                      ? "border-amber-100 text-amber-100"
                      : "border-transparent text-white hover:text-amber-50"
                  } flex items-center px-8 py-6 border-b-4 font-bold transition-all duration-200`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-8">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default MemberSettings;
