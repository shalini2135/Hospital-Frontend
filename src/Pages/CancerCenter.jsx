import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CancerCenter = () => {
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
          <h1 className="text-2xl font-bold">Cancer Center</h1>
          <p className="text-sm">Advanced care and research-driven treatment for cancer patients.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-6xl mx-auto px-6 py-10"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* About Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About Our Cancer Center</h2>
          <p className="text-gray-700 mb-4">
            Our Cancer Center provides comprehensive, personalized cancer treatment programs that integrate cutting-edge technology with compassionate care. We specialize in early detection, targeted therapies, radiation oncology, surgical oncology, and supportive care.
          </p>
          <p className="text-gray-700">
            Our multidisciplinary team ensures that every patient receives a treatment plan tailored to their unique case, improving outcomes and quality of life.
          </p>
        </motion.div>

        {/* Services Section */}
        <h2 className="text-xl font-bold mt-10 mb-6 text-center text-gray-800">Key Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Medical Oncology",
              desc: "Chemotherapy, immunotherapy, and hormone therapy treatments by expert oncologists."
            },
            {
              title: "Radiation Oncology",
              desc: "Precise and advanced radiation treatments including IMRT, IGRT, and brachytherapy."
            },
            {
              title: "Surgical Oncology",
              desc: "State-of-the-art surgical procedures for removing tumors with minimal invasiveness."
            },
            {
              title: "Palliative Care",
              desc: "Supportive care to manage pain, side effects, and improve quality of life."
            },
            {
              title: "Cancer Screening",
              desc: "Routine screening programs for early detection of breast, cervical, colon, and prostate cancer."
            },
            {
              title: "Patient Support",
              desc: "Nutritional, psychological, and rehabilitative support for patients and families."
            }
          ].map(({ title, desc }, index) => (
            <motion.div
              key={index}
              className="bg-blue-100 p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 30 }}
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

export default CancerCenter;




