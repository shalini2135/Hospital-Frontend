// components/PrescriptionTable.jsx
import React from "react";
import { Calendar, Stethoscope, Eye, Receipt, Pill } from "lucide-react";

const PrescriptionTable = ({
  isLoading,
  filteredPrescriptions,
  searchQuery,
  activeFiltersCount,
  filters,
  setFilters,
  handleViewDetails,
  handleViewBilling,
  handleDateClick,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setFilters({
      selectedDate: "",
      selectedDoctor: "",
      selectedDepartment: "",
      selectedPaymentStatus: "",
      dateRange: { start: "", end: "" },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Loading comprehensive patient history...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prescription & Visit Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Healthcare Provider & Patient
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medical Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Billing
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <tr
                key={prescription.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleDateClick(prescription.date)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Calendar className="mt-1" size={16} />
                    </button>
                    <div>
                      <button
                        onClick={() => handleDateClick(prescription.date)}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {formatDate(prescription.date)} at{" "}
                        {formatTime(prescription.time)}
                      </button>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Stethoscope
                        className="text-green-600 mt-1"
                        size={16}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {prescription.doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.doctor.department}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {prescription.diagnosis
                        .split(" ")
                        .slice(0, 3)
                        .join(" ")}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status.charAt(0).toUpperCase() +
                        prescription.status.slice(1)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(prescription)}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <Eye size={16} />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => handleViewBilling(prescription)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <Receipt size={16} />
                      <span>Billing</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-12">
          <Pill size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery || activeFiltersCount > 0
              ? "No matching prescriptions found"
              : "No prescriptions found"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery || activeFiltersCount > 0
              ? "Try adjusting your search terms or filters"
              : "Try adjusting your search criteria"}
          </p>
          {(searchQuery || activeFiltersCount > 0) && (
            <div className="mt-4 space-x-2">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrescriptionTable;