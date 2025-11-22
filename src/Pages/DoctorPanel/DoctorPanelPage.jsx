import React, { useState } from "react";
import DoctorInfoBar from "../../components/DoctorPanel/DoctorInfoBar";
import DoctorNavbar from "../../components/DoctorPanel/DoctorNavBar";
import { MedicalAppointments } from "../../components/DoctorPanel/MedicalAppointments";

const DoctorPanelPage = () => {
  const [doctor, setDoctor] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorNavbar doctor={doctor} />
      
      <div className="py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Doctor Panel
          </h1>
          <p className="mt-2 text-gray-600">Manage your appointments and patient care</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <DoctorInfoBar setDoctor={setDoctor} />
          <MedicalAppointments />
        </div>
      </div>
    </div>
  );
};

export default DoctorPanelPage;
