import React from "react";
import { Filter, X, CalendarDays, Users, DollarSign } from "lucide-react";

// Filter Panel Component
const FilterPanel = ({
  filters,
  setFilters,
  prescriptions,
  isOpen,
  onClose,
}) => {
  // Extract unique doctors (avoiding duplicates)
  const doctors = [...new Set(prescriptions.map((p) => p.doctor))].filter(
    (doctor, index, self) => self.findIndex((d) => d.id === doctor.id) === index
  );

  // Extract unique departments
  const departments = [
    ...new Set(prescriptions.map((p) => p.doctor.department)),
  ];

  // Extract unique payment statuses
  const paymentStatuses = [
    ...new Set(prescriptions.map((p) => p.billing.paymentStatus)),
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      selectedDate: "",
      selectedDoctor: "",
      selectedDepartment: "",
      selectedPaymentStatus: "",
      dateRange: { start: "", end: "" },
    });
  };

  const activeFiltersCount = Object.values(filters).filter((value) =>
    typeof value === "object" ? value.start || value.end : value
  ).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Filter className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Advanced Filters
            </h2>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CalendarDays className="mr-2 text-blue-600" size={20} />
              Date Filters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.selectedDate}
                  onChange={(e) =>
                    handleFilterChange("selectedDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        start: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        end: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Healthcare Provider Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="mr-2 text-blue-600" size={20} />
              Healthcare Provider
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.selectedDoctor}
                  onChange={(e) =>
                    handleFilterChange("selectedDoctor", e.target.value)
                  }
                >
                  <option value="">All Doctors</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.selectedDepartment}
                  onChange={(e) =>
                    handleFilterChange("selectedDepartment", e.target.value)
                  }
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Billing Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="mr-2 text-blue-600" size={20} />
              Billing Filters
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.selectedPaymentStatus || ""}
                onChange={(e) =>
                  handleFilterChange("selectedPaymentStatus", e.target.value)
                }
              >
                <option value="">All Payment Statuses</option>
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.selectedDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Date: {new Date(filters.selectedDate).toLocaleDateString()}
                    <button
                      onClick={() => handleFilterChange("selectedDate", "")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.selectedDoctor && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Doctor:{" "}
                    {doctors.find((d) => d.id === filters.selectedDoctor)?.name}
                    <button
                      onClick={() => handleFilterChange("selectedDoctor", "")}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.selectedDepartment && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Department: {filters.selectedDepartment}
                    <button
                      onClick={() =>
                        handleFilterChange("selectedDepartment", "")
                      }
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {filters.selectedPaymentStatus && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Payment:{" "}
                    {filters.selectedPaymentStatus.charAt(0).toUpperCase() +
                      filters.selectedPaymentStatus.slice(1)}
                    <button
                      onClick={() =>
                        handleFilterChange("selectedPaymentStatus", "")
                      }
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    Range: {filters.dateRange.start || "Start"} -{" "}
                    {filters.dateRange.end || "End"}
                    <button
                      onClick={() =>
                        handleFilterChange("dateRange", { start: "", end: "" })
                      }
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between">
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Clear All Filters
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;