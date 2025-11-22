// components/TabNavigation.jsx
import React from "react";
import { FileText, Activity, CheckCircle } from "lucide-react";

const TabNavigation = ({
  activeTab,
  setActiveTab,
  prescriptions,
  filteredPrescriptions,
}) => {
  const getTabIcon = (tabKey) => {
    switch (tabKey) {
      case "all":
        return <FileText size={16} className="mr-2" />;
      case "ongoing":
        return <Activity size={16} className="mr-2" />;
      case "completed":
        return <CheckCircle size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  const tabs = [
    {
      key: "all",
      label: "All Medical Records",
      count: prescriptions.length,
      description: "Complete prescription and treatment history",
      color: "text-gray-600",
    },
    {
      key: "ongoing",
      label: "Active Treatments",
      count: prescriptions.filter((p) => p.status === "ongoing").length,
      description: "Current medications and ongoing treatments",
      color: "text-blue-600",
    },
    {
      key: "completed",
      label: "Completed Treatments",
      count: prescriptions.filter((p) => p.status === "completed").length,
      description: "Finished prescriptions and past medical care",
      color: "text-green-600",
    },
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                {getTabIcon(tab.key)}
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span>{tab.label}</span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === tab.key
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {
                        filteredPrescriptions.filter((p) =>
                          tab.key === "all" ? true : p.status === tab.key
                        ).length
                      }
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tab.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;