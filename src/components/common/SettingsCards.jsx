import React from "react";

const SettingsCard = ({ title, value, bgColor, icon }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-gray-100 to-white py-5 px-8 rounded-xl border border-gray-300">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${bgColor} font-bold font-nunito-sans`}>
            {title}
          </p>
          <p className="text-2xl font-bold font-nunito-sans text-gray-700 mt-1">
            {value}
          </p>
        </div>
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${bgColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
