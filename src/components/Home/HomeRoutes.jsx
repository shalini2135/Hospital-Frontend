import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Cardiology from "./Cardiology";
import Pharmacy from "./pharmacy";
import PatientCare from "./PatientCare";
import GeneticTesting from "./GeneticTesting";
import Rehabilitation from "./Rehabilitation";
import MedicalRecords from "./MedicalRecords";
import TermsOfService from "../../Pages/TermsOfService";
import PrivacyPolicy from "../../Pages/PrivacyPolicy";
// import CancerCenter from '../../pages/CancerCenter';
// import HealthCheck from '../../pages/HealthCheck';
// import Fertility from '../../pages/FertilityAndReproductiveMedicine';
// import PediaTracks from '../../pages/PediaTracks';
import Career from "../Career";
import Feedback from "../Feedback";
import Insurance from "../Insurance";
import EnvironmentalForms from "../EnvironmentalForms";
import NewsLetter from "../NewsLetter";


const HomeRoutes = ({ onLoginClick, onSignupClick }) => {
  return (
    <Routes>
      <Route
        index
        element={<Home onLoginClick={onLoginClick} onSignupClick={onSignupClick} />}
      />
      <Route path="cardiology" element={<Cardiology />} />
      <Route path="pharmacy" element={<Pharmacy />} />
      <Route path="patient-care" element={<PatientCare />} />
      <Route path="genetic-testing" element={<GeneticTesting />} />
      <Route path="rehabilitation" element={<Rehabilitation />} />
      <Route path="medical-records" element={<MedicalRecords />} />
       <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* <Route path="/cancer-center" element={<CancerCenter />} /> */}
     {/* <Route path="/health-check" element={<HealthCheck />} /> */}
     {/* <Route path="/fertility" element={<Fertility />} /> */}
    {/* <Route path="/pediatracks" element={<PediaTracks />} /> */}
    <Route path="/career" element={<Career />} />
         <Route path="/feedback" element={<Feedback />} />
          <Route path="/Insurance" element={<Insurance />} />
          <Route path="/environmental-forms" element={<EnvironmentalForms/>}/>
          <Route path="/newsletter" element={<NewsLetter/>}/>
    </Routes>
  );
};

export default HomeRoutes;
