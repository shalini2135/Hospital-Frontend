import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const HealthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="bg-[#f1f6ff] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-[#2c64dd] text-white py-6 px-8 shadow flex items-center gap-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#244fc7] transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Health Check Program</h1>
          <p className="text-sm">Proactive care through preventive screenings and diagnostics.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-6xl mx-auto px-6 py-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Intro Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comprehensive Health Screening</h2>
          <p className="text-gray-700 mb-4">
            Our health check programs are designed to detect risk factors early, helping you take control of your health before problems arise.
          </p>
          <p className="text-gray-700">
            We offer tailor-made packages suitable for all age groups and lifestyles, including executive, cardiac, diabetic, senior citizen, and women’s health checkups.
          </p>
        </motion.div>

        {/* Packages Section */}
        <h2 className="text-xl font-bold mt-10 mb-6 text-center text-gray-800">Our Packages</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Executive Health Check",
              desc: "Designed for working professionals with complete screening and lifestyle counseling."
            },
            {
              title: "Cardiac Profile",
              desc: "ECG, echo, stress tests, and lipid profiles to assess heart health."
            },
            {
              title: "Diabetic Check",
              desc: "Blood sugar, HbA1c, foot exams, and eye checks for diabetic management."
            },
            {
              title: "Women’s Health",
              desc: "Includes pap smear, breast screening, hormone profiles and bone density test."
            },
            {
              title: "Senior Citizen Plan",
              desc: "Covers key geriatric conditions with consultation and mobility evaluation."
            },
            {
              title: "Custom Plans",
              desc: "Build your own package based on doctor’s recommendations."
            }
          ].map(({ title, desc }, index) => (
            <motion.div
              key={index}
              className="bg-blue-100 p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-[#2c64dd] mb-2">{title}</h3>
              <p className="text-sm text-gray-700">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-10 text-center">Last updated: July 26, 2025</p>
      </motion.div>
    </motion.div>
  );
};

export default HealthCheck;




