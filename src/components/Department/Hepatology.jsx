import React, { useEffect, useState } from "react";
import { Droplet, Phone, Mail } from "lucide-react";
import hepatology from "../../assets/hepatology.jpeg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getDoctorsBySpecialty } from "../../services/DoctorPanel/DoctorService";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

// Skeleton Loader
const DoctorSkeleton = () => (
  <div className="bg-white p-4 rounded-xl shadow-md w-full sm:w-[450px] h-auto animate-pulse flex flex-col items-center gap-4">
    <div className="w-28 h-28 rounded-full bg-gray-300"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    <div className="h-3 bg-gray-200 rounded w-full px-4 mt-2 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="w-full px-4 mt-4">
      <div className="w-full h-8 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const Hepatology = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBookClick = (doctor) => {
    navigate("/departments/appointment", { state: { doctor } });
  };

useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await getDoctorsBySpecialty("Hepatology");
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching hepatologists:", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };
  fetchDoctors();
}, []);


  return (
    <div className="min-h-screen bg-blue-100 pt-28 px-4 sm:px-6 flex flex-col items-center relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-lg px-4 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-6 bg-gradient-to-r from-blue-200 via-blue-100 to-white shadow-md"
      >
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Droplet className="w-10 h-10 text-red-500" />
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black">Hepatology</h2>
            <p className="text-lg sm:text-xl font-bold text-gray-500">Care for Your Liver</p>
          </div>
        </div>
        <button
          onClick={() => {
            document.getElementById("Doctors")?.scrollIntoView({ behavior: "smooth" });
          }}
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
            src={hepatology}
            alt="Hepatology Department"
            className="rounded-lg w-full max-w-[500px] h-auto max-h-[320px] object-cover shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 text-black space-y-4 text-sm sm:text-base mb-6">
          <motion.h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2 hover:text-blue-600 transition-colors duration-300">
            Department of Hepatology
          </motion.h2>
          {[
            "Our Hepatology department provides specialized care for liver diseases with a team of experienced hepatologists and dedicated support staff.",
            "We address a wide spectrum of liver-related conditions, including viral hepatitis, liver fibrosis, autoimmune liver disease, and hepatocellular carcinoma.",
            "From early diagnosis to liver transplant evaluation, we ensure personalized treatment paths tailored to each patient’s health status.",
            "The department is equipped with cutting-edge imaging, liver biopsy services, and multidisciplinary support to offer holistic care.",
            "Our mission is to improve liver health outcomes with compassion, advanced science, and continuous support.",
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={i + 1}
              className="text-justify"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Doctor List */}
      <h1 className="text-3xl font-bold text-black text-center scroll-mt-28" id="Doctors">
        Meet Our <span className="text-blue-600">Hepatologists</span>
      </h1>
      <p className="text-md text-gray-800 mt-2 mb-6 text-center max-w-xl">
        Connect with experienced liver specialists for personalized care.
      </p>

      <div className="flex flex-wrap justify-center gap-6 px-2 sm:px-0">
        {loading
          ? Array(1)
              .fill(0)
              .map((_, idx) => <DoctorSkeleton key={idx} />)
          : doctors.map((doctor, index) => (
              <motion.div
                key={doctor.doctorId}
                className="bg-white p-4 rounded-xl shadow-md w-full sm:w-[450px] h-auto flex flex-col items-center"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={index + 1}
              >
                <div className="w-28 h-28 overflow-hidden rounded-full bg-white shadow">
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.doctorName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold">{doctor.doctorName}</h2>
                  <p className="text-blue-600 text-sm">{doctor.specialty}</p>
                  <div className="flex justify-center items-center text-yellow-500 text-sm mt-1">
                    ★★★★☆<span className="text-black ml-2">4.2</span>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-4 text-left w-full px-4 space-y-1">
                  <p><strong>ID:</strong> {doctor.doctorId}</p>
                  <span
                    className={`inline-block mt-1 text-sm font-medium px-3 py-1 rounded-full 
                    ${doctor.status === "Active" || doctor.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {doctor.status}
                  </span>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                  <p><strong>Education:</strong> {doctor.education}</p>
                  <p><strong>Languages:</strong> {doctor.languages}</p>
                  <p className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {doctor.phone}</p>
                  <p className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {doctor.email}</p>
                </div>
               
<div className="mt-6 w-full px-4">
  <button
    onClick={() => {
      if (doctor.status === "Active" || doctor.status === "Available") {
        handleBookClick(doctor);
      }
    }}
    disabled={doctor.status === "On Leave" || doctor.status === "Inactive"}
    className={`w-full py-2 rounded-lg font-semibold transition ${
      doctor.status === "Active" || doctor.status === "Available"
        ? "bg-blue-600 text-white hover:bg-blue-800 cursor-pointer"
        : "bg-gray-400 text-gray-600 cursor-not-allowed"
    }`}
  >
    {doctor.status === "On Leave" || doctor.status === "Inactive" 
      ? "Currently Unavailable" 
      : "Book Appointment"
    }
  </button>
</div>
              </motion.div>
            ))}
      </div>

      <div className="h-[40px]" />
    </div>
  );
};

export default Hepatology;