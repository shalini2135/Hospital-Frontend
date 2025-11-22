import React from 'react';
import { X, Calendar, User, Stethoscope, Pill, Syringe, TestTube, Utensils, FileText } from 'lucide-react';

const ViewPrescriptionModal = ({ isOpen, onClose, prescription }) => {
  if (!isOpen || !prescription) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-5 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Prescription Details</h2>
            <p className="text-blue-100 text-sm">ID: {prescription.prescriptionId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
            aria-label="Close"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-8 space-y-8 flex-1">
          {/* Patient & Doctor Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                Patient Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {prescription.patientName}</p>
                <p><span className="font-medium">Patient ID:</span> {prescription.patientId}</p>
                <p><span className="font-medium">Appointment ID:</span> {prescription.appointmentId}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Stethoscope size={20} className="text-blue-500" />
                Doctor Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Doctor ID:</span> {prescription.doctorId}</p>
               
                <p>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    prescription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {prescription.status?.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-2 border-gray-200" />

          {/* Medicines Section */}
          {prescription.medicines && prescription.medicines.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Pill size={20} className="text-blue-500" />
                Prescribed Medicines
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-4">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-white p-4 rounded border border-gray-200 grid md:grid-cols-4 gap-4 items-center">
                      <div>
                        <span className="font-medium text-gray-600">Medicine:</span>
                        <p className="font-semibold">{medicine.name || medicine.medicineName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Dosage:</span>
                        <p>{medicine.dosage}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Duration:</span>
                        <p>{medicine.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Timing:</span>
                        <p>{medicine.timing ? medicine.timing.join(', ') : '-'}</p>
                      </div>
                      {medicine.instructions && (
                        <div className="md:col-span-4 mt-2">
                          <span className="font-medium text-gray-600">Instructions:</span>
                          <p className="text-gray-800">{medicine.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Injections Section */}
          {prescription.injections && prescription.injections.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Syringe size={20} className="text-blue-500" />
                Prescribed Injections
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-4">
                  {prescription.injections.map((injection, index) => (
                    <div key={index} className="bg-white p-4 rounded border border-gray-200 grid md:grid-cols-4 gap-4 items-center">
                      <div>
                        <span className="font-medium text-gray-600">Injection:</span>
                        <p className="font-semibold">{injection.name || injection.injectionName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Dosage:</span>
                        <p>{injection.dosage}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Schedule:</span>
                        <p>{injection.schedule || '-'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Notes:</span>
                        <p>{injection.notes || '-'}</p>
                      </div>
                      {injection.instructions && (
                        <div className="md:col-span-4 mt-2">
                          <span className="font-medium text-gray-600">Instructions:</span>
                          <p className="text-gray-800">{injection.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended Tests Section */}
          {prescription.recommendedTests && prescription.recommendedTests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TestTube size={20} className="text-blue-500" />
                Recommended Tests
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-4">
                  {prescription.recommendedTests.map((test, index) => (
                    <div key={index} className="bg-white p-4 rounded border border-gray-200 grid md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="font-medium text-gray-600">Test:</span>
                        <p className="font-semibold">{test || test.testName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Due Date:</span>
                        <p>{test.dueDate ? formatDate(test.dueDate) : 'As soon as possible'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Instructions:</span>
                        <p>{test.instructions || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Diet Plan Section */}
          {prescription.dietPlan && prescription.dietPlan.trim() !== '' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Utensils size={20} className="text-blue-500" />
                Diet Plan
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{prescription.dietPlan}</p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {prescription.notes && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Additional Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{prescription.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescriptionModal;

