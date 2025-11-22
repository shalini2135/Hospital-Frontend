// PatientHistory.jsx - API Integrated Version
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Header from "./Header";
import SearchAndFilters from "./SearchAndFilters";
import PrescriptionTable from "./PrescriptionTable";
import PrescriptionModal from "./PrescriptionModal";
import BillingModal from "./BillingModal";
import FilterPanel from "./FilterPanel";
import { searchPrescriptions } from "../../Utils/SearchUtils";

const PatientHistory = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    selectedDate: "",
    selectedDoctor: "",
    selectedDepartment: "",
    selectedPaymentStatus: "",
    dateRange: { start: "", end: "" },
  });

  // API base URLs
  const APPOINTMENT_API_BASE = "https://appoitment-backend.onrender.com/api";
  const BILLING_API_BASE = "https://billing-backend-0zk0.onrender.com/api";

  // Fetch prescriptions/appointments from API
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch patient history from appointments API
        const appointmentResponse = await fetch(
          `${APPOINTMENT_API_BASE}/appointments/patient/${patientId}/history`
        );

        if (!appointmentResponse.ok) {
          throw new Error(`Failed to fetch appointments: ${appointmentResponse.status}`);
        }

        const appointmentData = await appointmentResponse.json();
        console.log("Appointment data:", appointmentData);

        // Transform the appointment data to match your prescription format
        const transformedPrescriptions = await Promise.all(
          appointmentData.map(async (appointment) => {
            let billingData = null;

            // Fetch billing data for each appointment
            try {
              const billingResponse = await fetch(
                `${BILLING_API_BASE}/billing/by-appointment/${appointment._id || appointment.id}`
              );
              
              if (billingResponse.ok) {
                billingData = await billingResponse.json();
              }
            } catch (billingError) {
              console.warn(`Failed to fetch billing for appointment ${appointment._id}:`, billingError);
            }

            // Transform appointment to prescription format
            return {
              id: appointment._id || appointment.id,
              prescriptionNumber: appointment.appointmentNumber || `APP-${appointment._id}`,
              patientId: patientId,
              patientName: appointment.patientName || appointment.patient?.name || "Unknown Patient",
              date: appointment.appointmentDate || appointment.date || appointment.createdAt,
              doctor: {
                id: appointment.doctorId || appointment.doctor?._id,
                name: appointment.doctorName || appointment.doctor?.name || "Unknown Doctor",
                department: appointment.department || appointment.doctor?.specialization || "General"
              },
              medications: appointment.medications || appointment.prescription || [],
              diagnosis: appointment.diagnosis || appointment.notes || "No diagnosis provided",
              notes: appointment.notes || appointment.additionalNotes || "",
              status: appointment.status || "completed",
              billing: billingData ? {
                billId: billingData._id || billingData.id,
                billDate: billingData.createdAt || billingData.billDate || appointment.date,
                consultationFee: billingData.consultationFee || billingData.amount || 0,
                medicationTotal: billingData.medicationTotal || 0,
                subtotal: billingData.subtotal || billingData.amount || 0,
                discount: billingData.discount || 0,
                tax: billingData.tax || 0,
                finalAmount: billingData.finalAmount || billingData.totalAmount || billingData.amount || 0,
                paymentStatus: billingData.paymentStatus || "pending",
                paymentDate: billingData.paymentDate,
                paymentMethod: billingData.paymentMethod || "N/A"
              } : {
                // Default billing structure if no billing data found
                billId: `BILL-${appointment._id}`,
                billDate: appointment.date,
                consultationFee: 0,
                medicationTotal: 0,
                subtotal: 0,
                discount: 0,
                tax: 0,
                finalAmount: 0,
                paymentStatus: "pending",
                paymentDate: null,
                paymentMethod: "N/A"
              }
            };
          })
        );

        setPrescriptions(transformedPrescriptions);
        setFilteredPrescriptions(transformedPrescriptions);
      } catch (error) {
        console.error("Error fetching patient history:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  // Apply search & filters
  useEffect(() => {
    let filtered = prescriptions;

    // Apply search and advanced filters
    filtered = searchPrescriptions(filtered, searchQuery, filters);

    // Apply payment status filter
    if (filters.selectedPaymentStatus) {
      filtered = filtered.filter(
        (prescription) =>
          prescription.billing.paymentStatus === filters.selectedPaymentStatus
      );
    }

    setFilteredPrescriptions(filtered);
  }, [prescriptions, searchQuery, filters]);

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleViewBilling = (prescription) => {
    setSelectedPrescription(prescription);
    setIsBillingModalOpen(true);
  };

  const handleDateClick = (date) => {
    setFilters((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleBackToProfile = () => {
    navigate(`/patient/${patientId}`);
  };

  const activeFiltersCount = Object.values(filters).filter((value) =>
    typeof value === "object" ? value.start || value.end : value
  ).length;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header navigate={navigate} />
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Patient History</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigate={navigate} />

      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToProfile}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Patient Profile</span>
          </button>
        </div>

        {/* Patient History Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical History
          </h1>
          <p className="text-gray-600">Patient ID: {patientId}</p>
          {prescriptions.length > 0 && (
            <p className="text-sm text-gray-500">
              {prescriptions.length} record{prescriptions.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Search + Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          filteredPrescriptions={filteredPrescriptions}
          prescriptions={prescriptions}
          activeFiltersCount={activeFiltersCount}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
        />

        {/* All Records Title */}
        <div className="mt-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            All Medical Records
          </h2>
        </div>

        {/* Prescription Table */}
        <PrescriptionTable
          isLoading={isLoading}
          filteredPrescriptions={filteredPrescriptions}
          searchQuery={searchQuery}
          activeFiltersCount={activeFiltersCount}
          filters={filters}
          setFilters={setFilters}
          handleViewDetails={handleViewDetails}
          handleViewBilling={handleViewBilling}
          handleDateClick={handleDateClick}
        />
      </div>

      {/* Modals */}
      {isModalOpen && selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isBillingModalOpen && selectedPrescription && (
        <BillingModal
          prescription={selectedPrescription}
          onClose={() => setIsBillingModalOpen(false)}
        />
      )}

      {isFilterPanelOpen && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          prescriptions={prescriptions}
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientHistory;