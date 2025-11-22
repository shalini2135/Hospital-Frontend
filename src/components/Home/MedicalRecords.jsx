import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Animation variant like Cardiology
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom * 0.2 },
  }),
};

const MedicalRecords = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="bg-blue-50 min-h-screen text-blue-900 font-sans text-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center p-3 rounded-lg border border-transparent hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Medical Records</h1>
              <p className="text-blue-100 text-sm mt-1">24/7 access to health data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section
        className="bg-blue-50 py-10 px-6 md:flex items-center gap-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={1}
      >
        <div
          className="md:w-1/2 min-h-[50vh] bg-cover bg-center rounded-xl shadow-lg"
          style={{
            backgroundImage:
              "url('https://elitemedicalexperts.com/wp-content/uploads/2017/04/shutterstock_143828728-scaled.jpg')",
          }}
        ></div>

        <div className="md:w-1/2 mt-6 md:mt-0 max-w-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Digitally Secured and Organized
          </h3>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Our Medical Records department ensures secure, confidential, and
            streamlined access to patient histories, lab results, prescriptions,
            and imaging reports.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Access previous diagnoses, medications, and procedures</li>
            <li>Downloadable lab reports and prescriptions</li>
            <li>Track appointments and vaccination history</li>
            <li>HIPAA-compliant digital security protocols</li>
            <li>24/7 online access for registered patients</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We simplify your healthcare journey by keeping your information safe
            and always accessible.
          </p>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        className="py-10 px-6 bg-white text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={2}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-8">
          Why Choose Our Medical Records System?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Real-Time Updates",
              desc: "Records are updated instantly after consultations, ensuring up-to-date information.",
            },
            {
              title: "Remote Accessibility",
              desc: "Patients and healthcare providers can securely access documents from any device.",
            },
            {
              title: "Error-Free Documentation",
              desc: "Digitally maintained records reduce human errors and ensure data integrity.",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 p-6 rounded-xl shadow-md"
              variants={fadeInUp}
              custom={index + 3}
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">
                {card.title}
              </h4>
              <p className="text-gray-700">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Extra Section */}
      <motion.section
        className="py-12 px-6 bg-blue-50 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={6}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-8">
          What You Can Do With Your Medical Records
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-5xl mx-auto">
          {[
            {
              title: "Easily Share With Specialists",
              desc: "Forward your full medical history to new doctors for second opinions or referrals without repeating tests.",
            },
            {
              title: "Monitor Long-Term Conditions",
              desc: "Track how your chronic health metrics change over time and make informed decisions with your care team.",
            },
            {
              title: "Prepare for Emergencies",
              desc: "Quickly access critical health info such as blood type, allergies, or current medications when needed.",
            },
            {
              title: "Stay Informed & In Control",
              desc: "Empower yourself with knowledge—review reports, treatment plans, and prescriptions anytime.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg"
              variants={fadeInUp}
              custom={index + 7}
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default MedicalRecords;