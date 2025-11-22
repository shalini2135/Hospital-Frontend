import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What are your operating hours?',
      answer:
        'Our main hospital operates 24/7 for emergency services. Regular outpatient clinics are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 4:00 PM.'
    },
    {
      question: 'How do I schedule an appointment?',
      answer:
        'You can schedule an appointment by calling our main number, using our online booking system, or visiting our reception desk. We recommend booking in advance for specialist consultations.'
    },
    {
      question: 'What insurance plans do you accept?',
      answer:
        'We accept most major insurance plans including Medicare, Medicaid, and private insurance. Please contact our billing department to verify your specific coverage before your visit.'
    },
    {
      question: 'Do you offer emergency services?',
      answer:
        'Yes, we have a fully equipped emergency department that operates 24/7. For life-threatening emergencies, please call 911 or come directly to our emergency room.'
    },
    {
      question: 'Can I access my medical records online?',
      answer:
        'Yes, we offer a secure patient portal where you can access your medical records, test results, appointment history, and communicate with your healthcare providers.'
    },
    {
      question: 'What should I bring to my appointment?',
      answer:
        'Please bring a valid ID, insurance card, list of current medications, and any relevant medical records from other healthcare providers. Arrive 15 minutes early for check-in.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.section
      id="faq"
      className="py-20 bg-gray-50"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and facilities
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className={`h-5 w-5 ${activeIndex === index ? 'text-blue-600' : 'text-gray-400'}`} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQ;
