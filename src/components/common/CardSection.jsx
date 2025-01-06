import React from "react";
import SettingsCard from "./SettingsCards";

const CardSection = ({ title, cards }) => {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-primary-50 rounded-xl p-6 pb-10">
      <h3 className="text-xl font-nunito-sans font-extrabold text-primary-600 mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <SettingsCard
            key={index}
            title={card.title}
            value={card.value}
            bgColor={card.bgColor}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default CardSection;
