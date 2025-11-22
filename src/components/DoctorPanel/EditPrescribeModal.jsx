import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import EditPrescriptionForm from "./EditPrescriptionForm";


const EditPrescribeModal = ({
  isOpen,
  appointmentId,
  doctorId,
  patientId,
  patientName,
  existingPrescription,
  onClose,
  onSuccess
}) => {
  console.log("EditPrescribeModal props:", {
    appointmentId, doctorId, patientId, patientName, 
    existingPrescription: existingPrescription?.prescriptionId
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] p-0 overflow-hidden rounded-2xl">
        <div className="h-[90vh] flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <EditPrescriptionForm
              appointmentId={appointmentId}
              doctorId={doctorId}
              patientId={patientId}
              patientName={patientName}
              existingPrescription={existingPrescription}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrescribeModal;