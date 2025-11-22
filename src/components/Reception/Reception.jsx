import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Reception-Header";
import Registration from "../../Pages/Reception/Registration";
import Management from "../../Pages/Reception/Management";
import Appointment from "../../Pages/Reception/Appointment";
import Billing from "../../Pages/Reception/Billing";
import History from "../../Pages/Reception/History";
import PatientManagement from "../../Pages/Reception/PatientManagement";
// import Usage from "../../Pages/Reception/Usage";

export default function Reception() {
  return (
    <>
      {/* Always show Header */}
      <Header onDrawerToggle={() => {}} />

      {/* All child routes are rendered here */}
      <main style={{ padding: "1rem" }}>
       <Routes>
  <Route index element={<Registration />} />
  <Route path="registration" element={<Registration />} />
  <Route path="management" element={<PatientManagement />} />  
  <Route path="appointment" element={<Appointment />} />
  <Route path="generate-bill" element={<Billing />} />
  <Route path="bill-history" element={<History />} />
</Routes>

      </main>
    </>
  );
}
