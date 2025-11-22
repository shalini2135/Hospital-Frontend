import React, { useState } from "react";
//import { HashRouter } from "react-router-dom";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import UnauthorizedPage from "./components/UnauthroizedPage";
// Routes and Components
import HomeRoutes from "./components/Home/HomeRoutes";
import Patient from "./components/PatientProfile/Patient";
import Reception from "./components/Reception/Reception";
import Admin from "./components/Admin/Admin";
import DeptRoute from "./components/Department/DeptRoute";
import DoctorPanelPage from "./Pages/DoctorPanel/DoctorPanelPage";

// Login/Signup Components
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import CompletedTreatments from "./components/PatientProfile/CompletedTreatments";




function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <HomeRoutes
              onLoginClick={() => setShowLoginPopup(true)}
              onSignupClick={() => setShowSignupPopup(true)}
            />
          }
        />
       

    <Route path="/doctor/:id" element={<DoctorPanelPage />} />

<Route path="/departments/*" element={<DeptRoute />} />

<Route path="/patient/*" element={<Patient />} />



<Route path="/patient/:patientId" element={<Patient />} />

<Route path="/doctor/:id/patienthistory" element={<CompletedTreatments />} />

<Route path="/reception/*" element={<Reception />} />

<Route path="/admin/*" element={<Admin />} />
        {/* Don't touch below code or remove comment */}
        {/* Doctor Routes */}
        {/* <Route path="/doctor-panel" element={
          <ProtectedRoute roles={['ROLE_DOCTOR']}>
            <DoctorPanelPage />
          </ProtectedRoute>
         } /> */}

        {/* <Route path="/doctor-panel/patienthistory" element={
          <ProtectedRoute roles={['ROLE_DOCTOR']}>
            <CompletedTreatments />
          </ProtectedRoute>
        } /> */}

        {/* Patient Routes */}
        {/* <Route
          path="/patient/:patientId"
          element={
            <ProtectedRoute roles={["ROLE_PATIENT"]}>
              <Patient />
            </ProtectedRoute>
          }
        /> */}

        {/* Reception/Nurse Routes */}
        {/* <Route path="/reception/*" element={
          <ProtectedRoute roles={['ROLE_NURSE']}>
            <Reception />
          </ProtectedRoute>
        } /> */}

        {/* Admin Routes */}
        {/* <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/patient/:patientId/history"
          element={
            <ProtectedRoute roles={["ROLE_PATIENT"]}>
              <PatientHistory />
            </ProtectedRoute>
          }
        /> */}
        {/* Department Routes (adjust roles as needed) */}
        {/* <Route path="/departments/*" element={
          <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE']}>
            <DeptRoute />
          </ProtectedRoute>
        } /> */}

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
      </Routes>

      {/* Show Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <Login
            onClose={() => setShowLoginPopup(false)}
            onSignupClick={() => {
              setShowLoginPopup(false);
              setShowSignupPopup(true);
            }}
          />
        </div>
      )}

      {/* Show Signup Popup */}
      {showSignupPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <Signup
            onClose={() => setShowSignupPopup(false)}
            onLoginClick={() => {
              setShowSignupPopup(false);
              setShowLoginPopup(true);
            }}
          />
        </div>
      )}
    </Router>
  );
}

export default App;
