// src/components/Department/General.jsx

import React, { useEffect, useState } from "react";
import { Stethoscope, Phone, Mail } from "lucide-react";
import generalImg from "../../assets/general.jpg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getDoctorsBySpecialty } from "../../services/DoctorPanel/DoctorService";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-white p-4 rounded-xl shadow-md w-full sm:w-[450px] h-auto flex flex-col items-center">
    <div className="w-28 h-28 rounded-full bg-gray-300 mb-4" />
    <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
    <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
    <div className="h-3 w-16 bg-gray-200 rounded mb-4" />
    <div className="space-y-2 w-full px-4">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-full" />
    </div>
    <div className="mt-6 w-full px-4">
      <div className="h-10 bg-blue-300 rounded-lg" />
    </div>
  </div>
);

const General = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBookClick = (doctor) => {
    if (isDoctorAvailable(doctor.status)) {
      navigate("/departments/appointment", { state: { doctor } });
    }
  };

  const isDoctorAvailable = (status) => {
    const unavailableStatuses = [
      "on leave", "On Leave", "ON LEAVE",
      "leave", "Leave", "LEAVE",
      "inactive", "Inactive", "INACTIVE",
      "unavailable", "Unavailable", "UNAVAILABLE"
    ];
    return !unavailableStatuses.includes(status);
  };

  const getButtonStyles = (status) => {
    return isDoctorAvailable(status)
      ? "w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition cursor-pointer"
      : "w-full bg-gray-400 text-gray-200 py-2 rounded-lg font-semibold cursor-not-allowed opacity-60";
  };

  const getButtonText = (status) => {
    return isDoctorAvailable(status) ? "Book Appointment" : "Currently Unavailable";
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctorsBySpecialty("General");

        setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching general doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 pt-28 px-4 sm:px-6 flex flex-col items-center">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-lg px-4 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-6 bg-gradient-to-r from-blue-200 via-blue-100 to-white shadow-md"
      >
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Stethoscope className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black">General Doctors</h2>
            <p className="text-lg sm:text-xl font-bold text-gray-500">Your Health, Our Priority</p>
          </div>
        </div>
        <button
          onClick={() => document.getElementById("Doctors")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-blue-600 hover:bg-blue-800 text-white px-5 py-2 rounded-full font-semibold transition"
        >
          Find a Doctor
        </button>
      </motion.div>

      <hr className="w-full max-w-6xl border-t-2 border-black mb-10" />

      {/* Department Info */}
      <motion.div
        className="flex flex-col lg:flex-row bg-blue-100 mt-6 p-4 sm:p-6 mb-10 w-full max-w-6xl items-center gap-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
      >
        <div className="lg:w-1/2 flex justify-center items-center transition-transform duration-700 hover:scale-105">
          <img
            src={generalImg}
            alt="General Medicine Department"
            className="rounded-lg w-full h-auto max-h-[320px] object-cover shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 text-black space-y-4 text-sm sm:text-base mb-8">
          <motion.h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2 hover:text-blue-600 transition-colors duration-300">
            Department of General Medicine
          </motion.h2>
          {[
            "Our General Medicine department provides primary healthcare services for all age groups.",
            "We diagnose and treat a wide range of common illnesses and chronic conditions.",
            "Our doctors focus on preventive care and healthy lifestyle guidance.",
            "We ensure personalized treatment plans to meet your unique health needs.",
            "Your health and wellness is our topmost priority."
          ].map((text, i) => (
            <motion.p key={i} variants={fadeInUp} initial="hidden" animate="visible" custom={i + 1} className="text-justify">
              {text}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Doctor List */}
      <h1 className="text-3xl font-bold text-black text-center scroll-mt-28" id="Doctors">
        Meet Your <span className="text-blue-600">Doctors</span>
      </h1>
      <p className="text-md text-gray-800 mt-2 mb-6 text-center max-w-xl">
        Book appointments with experienced general physicians for your everyday healthcare needs.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {loading
          ? Array(3).fill().map((_, i) => <SkeletonCard key={i} />)
          : doctors?.length > 0
          ? doctors.map((doc, index) => (
              <motion.div
                key={doc.doctorId}
                className="bg-white p-4 rounded-xl shadow-md w-full sm:w-[450px] h-auto flex flex-col items-center"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={index + 1}
              >
                <div className="w-28 h-28 overflow-hidden rounded-full bg-white shadow">
                  <img
                    src={doc.photoUrl}
                    alt={doc.doctorName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold">{doc.doctorName}</h2>
                  <p className="text-blue-600 text-sm">{doc.specialty}</p>
                  <div className="flex justify-center items-center text-yellow-500 text-sm mt-1">
                    ★★★★☆<span className="text-black ml-2">4.5</span>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-4 text-left w-full px-4 space-y-1">
                  <p><strong>ID:</strong>{doc.doctorId}</p>
                  <span
                    className={`inline-block mt-1 text-sm font-medium px-3 py-1 rounded-full 
                    ${doc.status === "Active" || doc.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"}`}
                  >
                    {doc.status}
                  </span>
                  <p><strong>Experience:</strong> {doc.experience || "Not specified"}</p>
                  <p><strong>Education:</strong> {doc.education || "Not specified"}</p>
                  <p><strong>Languages:</strong> {Array.isArray(doc.languages) ? doc.languages.join(", ") : doc.languages || "Not specified"}</p>
                  <p className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {doc.phone}</p>
                  <p className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {doc.email}</p>
                </div>
                <div className="mt-6 w-full px-4">
                  <button
                    onClick={() => handleBookClick(doc)}
                    disabled={!isDoctorAvailable(doc.status)}
                    className={getButtonStyles(doc.status)}
                    title={!isDoctorAvailable(doc.status) ? "Doctor is currently unavailable" : "Click to book appointment"}
                  >
                    {getButtonText(doc.status)}
                  </button>
                </div>
              </motion.div>
            ))
          : <p className="text-center text-gray-600">No general doctors found.</p>}
      </div>

      <div className="h-[40px]" />
    </div>
  );
};

export default General;
