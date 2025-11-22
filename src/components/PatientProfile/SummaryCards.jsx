// components/SummaryCards.jsx
import React from "react";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

const SummaryCards = ({ filteredPrescriptions }) => {
  const cards = [
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${card.bgColor} rounded-lg`}>
                <IconComponent className={card.iconColor} size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;