import React from "react";

const SavingsTab = ({ savingsSettings, setSavingsSettings }) => {
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
};

export default SavingsTab;
