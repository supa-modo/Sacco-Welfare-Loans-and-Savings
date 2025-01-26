import React from "react";
import CardSection from "../common/CardSection";
import {
  CogIcon,
  UserGroupIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const GeneralTab = ({ systemSettings, setSystemSettings }) => {
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
                <div className="text-sm text-gray-600 font-medium">{value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
