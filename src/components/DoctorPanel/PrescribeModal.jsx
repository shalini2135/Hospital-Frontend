import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import PrescriptionForm from "../../Pages/DoctorPanel/PrescriptionForm";

const PrescribeModal = ({
  isOpen,
    appointmentId,
    doctorId,
    patientId,
    patientName,
    onClose,
    onSuccess
}) => {
  // Debug logs to verify correct IDs are being passed
  console.log("PrescribeModal props  :", {
    appointmentId, doctorId, patientId, patientName, onClose, onSuccess
  });
// Debug logs to verify correct IDs are being passed
// console.log("PrescribeModal props:", {
//   appointmentId, 
//   doctorId, 
//   patientId: patientId || 'MISSING', 
//   patientName: patientName || 'MISSING', 
//   onClose, 
//   onSuccess
// });

// NEW: Add warning for missing data
if (!patientId || !patientName) {
  console.warn("⚠️ PrescribeModal received incomplete patient data!");
}
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0 overflow-hidden rounded-2xl">
        <div className="h-[90vh] flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <PrescriptionForm
              appointmentId={appointmentId}
              doctorId={doctorId}
              patientId={patientId}
              patientName={patientName}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescribeModal;