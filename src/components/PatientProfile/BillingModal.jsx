// components/BillingModal.jsx
import React from "react";
import { X, Receipt, Printer, Download, DollarSign } from "lucide-react";


const BillingModal = ({ prescription, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePrint = () => {
    printBilling(prescription);
  };

  const handleDownloadPDF = () => {
    downloadBillingPDF(prescription);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header matching the design */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Billing Details
              </h2>
              <p className="text-sm text-gray-600">
                Bill ID: {prescription.billing.billId} | Date:{" "}
                {formatDate(prescription.billing.billDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Status Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Payment Status</h3>
                <p className="text-sm text-gray-600">Current billing status</p>
              </div>
            </div>
            <span
              className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getPaymentStatusColor(
                prescription.billing.paymentStatus
              )}`}
            >
              {prescription.billing.paymentStatus.charAt(0).toUpperCase() +
                prescription.billing.paymentStatus.slice(1)}
            </span>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Billing Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Billing Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium">
                    {formatCurrency(prescription.billing.consultationFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medications</span>
                  <span className="font-medium">
                    {formatCurrency(prescription.billing.medicationTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(prescription.billing.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(prescription.billing.discount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {formatCurrency(prescription.billing.tax)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Final Amount
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(prescription.billing.finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(prescription.billing.paymentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.billing.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prescription Number</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.prescriptionNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.doctor.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">
                    {prescription.doctor.department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;