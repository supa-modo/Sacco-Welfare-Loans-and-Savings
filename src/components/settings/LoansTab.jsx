import React from "react";
import CardSection from "../common/CardSection";
import {
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const LoansTab = ({ loanSettings, setLoanSettings }) => {
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
};

export default LoansTab;
