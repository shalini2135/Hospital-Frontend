import React, { useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Reusable fadeIn variant
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom * 0.2 },
  }),
};

const Cardiology = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="font-sans text-lg"
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
              <h1 className="text-xl font-semibold">Cardiology Service</h1>
              <p className="text-blue-100 text-sm mt-1">
                24/7 emergency cardiac services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Heart Services */}
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
              "url('https://southdenver.com/wp-content/uploads/2022/08/heart-specialist.jpg')",
          }}
        ></div>

        <div className="md:w-1/2 mt-6 md:mt-0 max-w-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Personalized Cardiac Care
          </h3>
          <p className="text-gray-800 mb-4 leading-relaxed">
            At our facility, heart care means more than tests—it means trust.
            We specialize in:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Advanced imaging (2D/3D Echo, ECG, Cardiac MRI)</li>
            <li>Non-invasive rhythm monitoring</li>
            <li>Stress tests and pre-op evaluations</li>
            <li>Lifestyle support and cardiac rehab planning</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Whether you're seeking diagnosis or recovery guidance, our
            personalized care pathways ensure clarity, comfort, and continuity
            for every heartbeat.
          </p>
        </div>
      </motion.section>

      {/* Our Cardiologists */}
      <motion.section
        className="py-10 px-6 bg-white text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={2}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-8">Our Cardiologists</h2>

        {/* Doctor 1 */}
        <motion.div
          className="md:flex items-center gap-8 mb-10 text-left"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={3}
        >
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://tse2.mm.bing.net/th/id/OIP.BVLxB8CbqkSbBBckNrY6_QHaHa?pid=Api&P=0&h=180"
              alt="Dr. Kavita Sharma"
              className="rounded-xl w-72 shadow-lg"
            />
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              Dr. Kavita Sharma
            </h3>
            <p className="text-gray-700 mb-2">Cardiac Imaging Specialist</p>
            <p className="text-gray-800 leading-relaxed">
              Dr. Kavita leads our imaging diagnostics team, offering clarity
              and precision in cardiovascular evaluations. Her empathetic
              approach ensures patients feel at ease through each step.
            </p>
          </div>
        </motion.div>

        {/* Doctor 2 */}
        <motion.div
          className="md:flex items-center gap-8 text-left bg-blue-50 py-10 px-4 rounded-xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={4}
        >
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREL6ufFK4TA_K2m7Hjr5rcNTHnqjawSkQh2g&s"
              alt="Dr. Rohan Das"
              className="rounded-xl w-72 shadow-lg"
            />
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              Dr. Rohan Das
            </h3>
            <p className="text-gray-700 mb-2">Heart Failure Specialist</p>
            <p className="text-gray-800 leading-relaxed">
              With over a decade of experience in cardiac care, Dr. Rohan
              focuses on long-term treatment plans for chronic heart
              conditions. His mission: to help every patient live confidently
              and comfortably.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Mission */}
      <motion.section
        className="py-10 bg-white text-center px-6"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={5}
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Our Mission</h2>
        <p className="text-gray-800 leading-relaxed max-w-3xl mx-auto text-left text-lg">
          To advance heart health with a holistic, patient-first approach.
          Through innovation, compassion, and world-class care, we aim to make
          every beat count.
        </p>
      </motion.section>

      {/* Heart Health Tips */}
      <motion.section
        className="py-10 bg-blue-50 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={6}
      >
        <h2 className="text-2xl font-bold mb-8 text-blue-900">Heart Health Tips</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {[
            {
              emoji: "🥗",
              text:
                "Eat a heart-smart diet with leafy greens, fresh fruits, and whole grains. Nutrition is your first line of defense!",
            },
            {
              emoji: "🏃‍♀",
              text:
                "Exercise daily for at least 30 minutes to strengthen your cardiovascular system and reduce stress.",
            },
            {
              emoji: "🧘‍♂",
              text:
                "Practice yoga and deep breathing to manage anxiety and boost heart resilience.",
            },
            {
              emoji: "🩺",
              text:
                "Schedule regular heart checkups, especially if you have a family history or existing health conditions.",
            },
          ].map((tip, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-left"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={7 + index}
            >
              <div className="text-5xl mb-4">{tip.emoji}</div>
              <p className="text-gray-800">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Cardiology;