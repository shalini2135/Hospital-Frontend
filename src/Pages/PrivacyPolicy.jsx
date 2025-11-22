import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ Import motion

const PrivacyPolicy = () => {
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
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="text-sm">Your privacy is our priority.</p>
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Commitment to Your Privacy
          </h2>
          <p className="text-gray-700 mb-4">
            We are committed to protecting your personal information and your right to privacy.
            This policy outlines what data we collect, how we use it, and your rights regarding it.
          </p>
          <p className="text-gray-700 mb-4">
            By using our services, you agree to the collection and use of information in accordance
            with this policy. If you do not agree, please refrain from using the service.
          </p>
          <p className="text-gray-700">
            This Privacy Policy applies to all users of our services, including customers,
            visitors, and third-party service users.
          </p>
        </motion.div>

        {/* Sections */}
        <h2 className="text-xl font-bold mt-10 mb-6 text-center text-gray-800">
          Important Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Information We Collect",
              desc: "We may collect personal data such as your name, email address, device information, and usage data to improve our services."
            },
            {
              title: "Use of Data",
              desc: "Your data helps us provide a personalized experience, send updates, and enhance the overall performance of our platform."
            },
            {
              title: "Data Security",
              desc: "We use encryption, secure storage, and other methods to protect your data from unauthorized access or breaches."
            },
            {
              title: "Cookies & Tracking",
              desc: "Our services use cookies to understand user behavior and improve usability. You can opt out through browser settings."
            },
            {
              title: "Your Rights",
              desc: "You have the right to access, modify, or delete your personal data. Contact us to exercise your data rights at any time."
            },
            {
              title: "Third-Party Services",
              desc: "We may integrate with third-party tools. These tools may have their own privacy policies which we encourage you to review."
            },
            {
              title: "Policy Changes",
              desc: "We reserve the right to update this Privacy Policy. Changes will be posted here with a new effective date."
            },
            {
              title: "Governing Law",
              desc: "This policy is governed under the laws of the jurisdiction where our company is registered."
            },
            {
              title: "Contact Information",
              desc: "For questions about this policy, email us at privacy@example.com."
            }
          ].map(({ title, desc }, idx) => (
            <motion.div
              key={idx}
              className="bg-blue-100 p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-[#2c64dd] mb-2">{title}</h3>
              <p className="text-sm text-gray-700">{desc}</p>
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

export default PrivacyPolicy;






