// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import PatientProfile from "./PatientProfile";
// import EditProfileModel from "./EditProfileModel";
// import PatientHistory from "./PatientHistory"; // ✅ default import
// import CancelAppointmentModal from "./CancelAppointmentModal";
// import RescheduleAppointmentModal from "./RescheduleAppointmentModal";
// const Patient = () => {
//   return (
//     <Routes>
//       <Route index element={<PatientProfile />} />
//       <Route path="edit-profile" element={<EditProfileModel />} />
//       <Route path="history" element={<PatientHistory />} />
//       <Route path="cancel-appointment" element={<CancelAppointmentModal />} />
//       <Route path="reschedule-appointment" element={<RescheduleAppointmentModal />} />
//     </Routes>
//   );
// };

// export default Patient;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PatientProfile from "./PatientProfile";
import EditProfileModel from "./EditProfileModel";
import PatientHistory from "./PatientHistory";

const Patient = () => {
  return (
    <Routes>
      <Route index element={<PatientProfile />} />
      <Route path="edit-profile" element={<EditProfileModel />} />
     <Route path=":patientId/history" element={<PatientHistory />} />
    </Routes>
  );
};

export default Patient;