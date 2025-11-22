import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const EnvironmentalForms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formSections = [
    {
      title: "Why Environmental Forms Matter",
      content:
        "Environmental forms help monitor and manage waste disposal, water usage, and pollution control measures across the hospital. They ensure regulatory compliance and promote eco-conscious operations.",
    },
    {
      title: "Types of Environmental Forms",
      content:
        "📄 Bio-medical Waste Tracking Forms\n" +
        "🌊 Water Consumption Monitoring Sheets\n" +
        "💨 Air Quality Checklists\n" +
        "🌿 Green Audit Compliance Reports\n" +
        "🧪 Chemical Disposal Logs",
    },
    {
      title: "Where to Access Forms",
      content:
        "🌐 Hospital Internal Portal (Environment Section)\n" +
        "🗂️ Printed copies available at Admin Office\n" +
        "📥 Request through environment@ourhospital.com",
    },
    {
      title: "Who Must Fill These Forms?",
      content:
        "🧑‍🔬 Lab & Medical Waste Handlers\n" +
        "🧹 Housekeeping Supervisors\n" +
        "🛠️ Facility and Maintenance Staff\n" +
        "🧑‍⚕️ Environmental Officers",
    },
    {
      title: "How We Use the Data",
      content:
        "✅ Ensure eco-friendly operations\n" +
        "✅ Report to health & environment authorities\n" +
        "✅ Improve sustainability initiatives\n" +
        "✅ Detect issues in real-time and act",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-4 px-6 flex items-center rounded-b-2xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-lg"></span>
        </button>
        <h1 className="text-2xl font-bold ml-6">Environmental Forms</h1>
      </div>

      {/* Content */}
      <motion.div
        className="px-6 py-8 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {formSections.map((section, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={fadeInUp}
            className={`rounded-2xl p-6 shadow-md whitespace-pre-line ${
              index % 2 === 0 ? "bg-white" : "bg-blue-50"
            }`}
          >
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default EnvironmentalForms;