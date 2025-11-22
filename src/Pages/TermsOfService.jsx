import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ import motion

const TermsOfService = () => {
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
      {/* Header with Back Button */}
      <motion.div
        className="bg-[#2c64dd] text-white py-6 px-8 shadow flex items-center gap-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#244fc7] transition duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Terms of Service</h1>
          <p className="text-sm">Please read these terms carefully.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-6xl mx-auto px-6 py-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Agreement Between User and Our Service
          </h2>
          <p className="text-gray-700 mb-4">
            These Terms of Service govern your access to and use of our services.
            By using our platform, you agree to comply with these terms.
          </p>
          <p className="text-gray-700 mb-4">
            If you do not agree to these terms, you should not use our services.
            Continued use of our services indicates your full agreement with these terms.
          </p>
          <p className="text-gray-700">
            These terms apply to all users of our services, including without limitation users who are browsers, vendors, customers, and/or contributors of content.
          </p>
        </div>

        {/* Important Sections */}
        <h2 className="text-xl font-bold mt-10 mb-6 text-center text-gray-800">
          Important Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "User Responsibilities",
              text: "You are responsible for maintaining the confidentiality of your account, protecting your login credentials, and ensuring the accuracy of all information provided to us."
            },
            {
              title: "Prohibited Uses",
              text: "You agree not to misuse our services, including attempting unauthorized access, distributing malware, or using the service for any unlawful purposes."
            },
            {
              title: "Changes to Terms",
              text: "We reserve the right to modify these terms at any time. It is your responsibility to check this page periodically for changes."
            },
            {
              title: "Limitation of Liability",
              text: "In no event shall our service be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use the platform."
            },
            {
              title: "Governing Law",
              text: "These terms shall be governed in accordance with the laws of the jurisdiction where our company is registered, without regard to its conflict of law provisions."
            },
            {
              title: "Contact Information",
              text: "If you have any questions about these Terms, please contact us at support@example.com."
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              className="bg-blue-100 p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-[#2c64dd] mb-2">{section.title}</h3>
              <p className="text-sm text-gray-700">{section.text}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-10 text-center">
          Last updated: July 26, 2025
        </p>
      </motion.div>
    </motion.div>
  );
};

export default TermsOfService;








