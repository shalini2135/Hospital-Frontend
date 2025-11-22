// components/PrescriptionModal.jsx
import React from "react";
import { X, Printer, Download, User, Pill, Clipboard } from "lucide-react";


const PrescriptionModal = ({ prescription, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePrint = () => {
    printPrescription(prescription);
  };

  const handleDownloadPDF = () => {
    downloadPrescriptionPDF(prescription);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">
                {prescription.hospitalName}
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {prescription.hospitalAddress}
              </p>
              <p className="text-blue-100 text-xs mt-1">
                Phone: {prescription.hospitalPhone}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Doctor and Visit Information */}
        <div className="p-8 space-y-6">
          <div className="text-center border-b border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {prescription.doctor.name}
            </h2>
            <p className="text-gray-600">{prescription.doctor.mbbs}</p>
            <p className="text-gray-600">
              {prescription.doctor.department} -{" "}
              {prescription.doctor.specialization}
            </p>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="font-semibold">Consultation Time:</p>
                <p className="whitespace-pre-line">
                  {prescription.consultationTime}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  APT-{prescription.appointmentNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Comprehensive Patient Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-bold text-lg">{prescription.patient.name}</p>
                <p className="text-sm">DOB: {prescription.patient.dateOfBirth}</p>
              </div>
              <div></div>
              <div className="text-right">
                <p className="font-bold">{formatDate(prescription.date)}</p>
              </div>
            </div>
          </div>

          {/* Visit Reason and Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Clipboard className="mr-2 text-yellow-600" size={16} />
                Visit Reason
              </h4>
              <p className="text-sm text-gray-800">{prescription.visitReason}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <p className="text-sm text-gray-800">{prescription.diagnosis}</p>
            </div>
          </div>

          {/* Medications Table */}
          <div className="overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Pill className="mr-2 text-green-600" size={20} />
              Prescribed Medications
            </h3>
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                    Rx
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                    Medication Details
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                    Dosage & Frequency
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                    Duration & Instructions
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-bold">
                    Pharmacy Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescription.medications.map((medication, index) => (
                  <tr key={medication.id}>
                    <td className="border border-gray-300 px-3 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="font-semibold">{medication.name}</div>
                      <div className="text-gray-600 text-xs">
                        Generic: {medication.genericName}
                      </div>
                      <div className="text-gray-600 text-xs">
                        Manufacturer: {medication.manufacturer}
                      </div>
                      <div className="text-gray-600 text-xs">
                        Lot: {medication.lotNumber}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="font-medium">{medication.dosage}</div>
                      <div className="text-xs">{medication.frequency}</div>
                      <div className="text-xs">Qty: {medication.quantity}</div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="text-xs mb-1">
                        <strong>Duration:</strong> {medication.duration}
                      </div>
                      <div className="text-xs mb-1">
                        <strong>Instructions:</strong> {medication.instructions}
                      </div>
                      <div className="text-xs">
                        <strong>Refills:</strong> {medication.refillsRemaining}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="text-xs">
                        <strong>Expires:</strong> {medication.expiryDate}
                      </div>
                      <div className="text-xs">
                        <strong>Price:</strong> $
                        {medication.totalPrice.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{prescription.doctor.name}</p>
                <p className="text-sm text-gray-600">{prescription.doctor.mbbs}</p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex px-3 py-1 text-sm font-bold rounded-full border ${getStatusColor(
                    prescription.status
                  )}`}
                >
                  {prescription.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;