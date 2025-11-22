  import React from "react";
  import { Routes, Route } from "react-router-dom";
  import Cardio from "./Cardio";
  import Header from "../Home/Header";
  import Hepatology from "./Hepatology";
  import Eyecare from "./EyeCare";
  import Fertility from "./Fertility";
  import Psychology from "./Psychology";
  import Pediatrics from "./Pediatrics";
  import Neuro from "./Neuro";
  import Dental from "./Dental";
  import General from "./General";
  import AppointmentPage from "./AppointmentPage";

function DeptRoute() {
  return (
    <>
      <Header />
     <Routes>
  <Route path="cardiology" element={<Cardio />} />
  <Route path="hepatology" element={<Hepatology />} />
  <Route path="eyecare" element={<Eyecare />} />
  <Route path="dental" element={<Dental />} />
  <Route path="appointment" element={<AppointmentPage />} />
  <Route path="pediatrics" element={<Pediatrics />} />
  <Route path="psychology" element={<Psychology />} />
  <Route path="neurology" element={<Neuro />} />
  <Route path="fertility" element={<Fertility />} />
  <Route path="general" element={<General />} />
</Routes>

      </>
    );
  }

  export default DeptRoute;