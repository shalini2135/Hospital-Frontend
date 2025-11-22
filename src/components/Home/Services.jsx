import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Pill,
  UserCheck,
  Dna,
  Armchair as Wheelchair,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

// Variants
const sectionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, delay: 0.2 } },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Cardiology",
      path: "/cardiology",
      description:
        "Comprehensive heart care with advanced diagnostic and treatment options for all cardiovascular conditions.",
    },
    {
      icon: <Pill className="h-8 w-8 text-green-600" />,
      title: "Pharmacy Services",
      path: "/pharmacy",
      description:
        "Full-service pharmacy with medication management and consultation services available 24/7.",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-blue-600" />,
      title: "Patient Care",
      path: "/patient-care",
      description:
        "Personalized patient care services with dedicated support staff and care coordinators.",
    },
    {
      icon: <Dna className="h-8 w-8 text-yellow-600" />,
      title: "Genetic Testing",
      path: "/genetic-testing",
      description:
        "Advanced genetic testing and counseling services for personalized medicine approaches.",
    },
    {
      icon: <Wheelchair className="h-8 w-8 text-orange-600" />,
      title: "Rehabilitation",
      path: "/rehabilitation",
      description:
        "Complete rehabilitation services including physical therapy and occupational therapy.",
    },
    {
      icon: <FileText className="h-8 w-8 text-gray-700" />,
      title: "Medical Records",
      path: "/medical-records",
      description:
        "Secure digital medical records management with easy access and comprehensive documentation.",
    },
  ];

  return (
    <motion.section
      id="services"
      className="py-20 bg-blue-50"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl font-extrabold text-gray-800 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Our Services
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare services designed to meet all your medical
            needs with excellence and compassion
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.06,
                rotate: 1,
                boxShadow: "0 12px 24px rgba(0, 0, 255, 0.15)",
              }}
              onClick={() => navigate(service.path)}
              className="bg-white rounded-2xl p-8 border border-blue-100 group cursor-pointer transition-all hover:bg-blue-100"
            >
              <motion.div
                whileHover={{
                  rotate: 360,
                  scale: 1.3,
                }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-6 inline-block"
              >
                {service.icon}
              </motion.div>

              <motion.h3
                whileHover={{ scale: 1.05, color: "#2563eb" }}
                className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors"
              >
                {service.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-gray-600 leading-relaxed"
              >
                {service.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Services;
