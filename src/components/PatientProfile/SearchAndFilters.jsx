// components/SearchAndFilters.jsx
import React from "react";
import { Search, X, Filter, Calendar, Stethoscope, Building, DollarSign } from "lucide-react";

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  filteredPrescriptions,
  prescriptions,
  activeFiltersCount,
  setIsFilterPanelOpen,
}) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by doctor, patient, medication, date (YYYY-MM-DD or MM/DD/YYYY), diagnosis, bill ID, prescription number, phone, email, department, insurance, vital signs, lab results, pharmacy, hospital details..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterPanelOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm relative"
        >
          <Filter size={20} className="text-gray-600" />
          <span className="font-medium text-gray-700">Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Results and Active Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {searchQuery && (
          <div className="text-sm text-gray-600">
            {filteredPrescriptions.length > 0 ? (
              <span>
                Found{" "}
                <span className="font-semibold text-blue-600">
                  {filteredPrescriptions.length}
                </span>
                {filteredPrescriptions.length === 1 ? " result" : " results"}
              </span>
            ) : (
              <span className="text-red-600">No results found</span>
            )}
          </div>
        )}

        {/* Active Filter Tags */}
        {filters.selectedDate && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            <Calendar size={14} className="mr-1" />
            {new Date(filters.selectedDate).toLocaleDateString()}
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, selectedDate: "" }))
              }
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {filters.selectedDoctor && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <Stethoscope size={14} className="mr-1" />
            Dr.{" "}
            {
              prescriptions
                .find((p) => p.doctor.id === filters.selectedDoctor)
                ?.doctor.name.split(" ")[1]
            }
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, selectedDoctor: "" }))
              }
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {filters.selectedDepartment && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            <Building size={14} className="mr-1" />
            {filters.selectedDepartment}
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, selectedDepartment: "" }))
              }
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {filters.selectedPaymentStatus && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            <DollarSign size={14} className="mr-1" />
            {filters.selectedPaymentStatus.charAt(0).toUpperCase() +
              filters.selectedPaymentStatus.slice(1)}
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  selectedPaymentStatus: "",
                }))
              }
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
              <X size={14} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;