import React, { useEffect } from "react";
import { ShieldCheck, Hospital, HeartPulse, FileCheck2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Insurance = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top Bar */}
      <motion.div
        className="bg-blue-600 text-white py-4 px-6 flex items-center rounded-b-2xl shadow-md"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-lg"></span>
        </button>
        <h1 className="text-2xl font-bold ml-6">Insurance and Tie-Ups</h1>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="px-6 sm:px-8 md:px-16 py-10 space-y-12"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Intro Paragraph */}
        <motion.p
          className="text-center text-gray-700 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We have established partnerships with various insurance providers and
          government schemes to ensure smooth and hassle-free patient services.
        </motion.p>

        {/* Insurance Types Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {[
            {
              icon: <ShieldCheck className="mx-auto text-blue-600 mb-4" size={40} />,
              title: "Government Schemes",
              desc: "Including Ayushman Bharat, ECHS, CGHS, and various state-level schemes.",
            },
            {
              icon: <HeartPulse className="mx-auto text-pink-500 mb-4" size={40} />,
              title: "Private Health Insurance",
              desc: "We support major private providers like Star Health, HDFC Ergo, ICICI Lombard, etc.",
            },
            {
              icon: <Hospital className="mx-auto text-green-600 mb-4" size={40} />,
              title: "Corporate Tie-Ups",
              desc: "Special coverage and cashless services for employees of partner companies and organizations.",
            },
          ].map(({ icon, title, desc }, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {icon}
              <h3 className="font-semibold text-lg text-blue-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Claim Process Section */}
        <motion.div
          className="bg-blue-50 rounded-2xl shadow-inner p-6 sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-semibold text-blue-900 mb-4">How to Claim Insurance</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Bring your insurance card or documents during admission.</li>
            <li>Our TPA desk will help verify insurance eligibility.</li>
            <li>Cashless service available for major insurance providers.</li>
            <li>Reimbursement support available with complete billing details.</li>
          </ul>
        </motion.div>

        {/* Assistance Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <FileCheck2 className="mx-auto text-indigo-600 mb-4" size={40} />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-gray-700 max-w-xl mx-auto">
            Our Insurance Desk is here to assist. Email us at{" "}
            <span className="font-medium text-blue-600">insurance@meditrack.com</span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Insurance;
