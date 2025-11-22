import React, { useState } from 'react';
import { Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    department: '',
    doctor: '',
    message: '',
    appointmentType: '',
    consentGiven: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const departments = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Gastroenterology',
  ];

  const doctorMap = {
    Cardiology: ['Dr. R. Suresh', 'Dr. V. Meenakshi', 'Dr. K. Rajendran'],
    Neurology: ['Dr. M. Aravind', 'Dr. R. Latha Narayanan', 'Dr. S. Raghavan'],
    Pediatrics: ['Dr. V. Priya Balasubramanian', 'Dr. G. Karthik', 'Dr. S. Anitha'],
    Orthopedics: ['Dr. R. Murugan', 'Dr. K. Deepa', 'Dr. T. Vignesh'],
    Dermatology: ['Dr. S. Keerthana', 'Dr. A. Manikandan', 'Dr. R. Janani'],
    Gastroenterology: ['Dr. M. Bhuvaneshwari ', 'Dr. N. Dinesh Kumar', 'Dr. R. Abinaya'],
  };

  const appointmentTypes = ['New Consultation', 'Follow-up', 'Routine Checkup'];

  const filteredDoctors = formData.department ? doctorMap[formData.department] || [] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitted(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        department: '',
        doctor: '',
        message: '',
        appointmentType: '',
        consentGiven: false,
      });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'department' && { doctor: '' }),
    }));
  };

  const isFormIncomplete =
    !formData.name ||
    !formData.email ||
    !formData.phone ||
    !formData.date ||
    !formData.department ||
    !formData.doctor ||
    !formData.appointmentType ||
    !formData.consentGiven;

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="appointment" className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule your appointment with our experienced healthcare professionals
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Appointment Requested!</h3>
                <p className="text-gray-600">
                  Thank you for your appointment request. We'll contact you soon to confirm your appointment.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-2" /> Full Name
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-2" /> Email Address
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-2" /> Phone Number
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit number" pattern="[0-9]{10}" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" /> Preferred Date & Time
                    </label>
                    <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                    <select name="doctor" value={formData.doctor} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                      <option value="">Select Doctor</option>
                      {filteredDoctors.map((doctor) => (
                        <option key={doctor} value={doctor}>{doctor}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                    <select name="appointmentType" value={formData.appointmentType} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                      <option value="">Select Type</option>
                      {appointmentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="inline h-4 w-4 mr-2" /> Symptoms
                  </label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Any additional information or specific requirements..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 resize-none" />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-2 pt-2">
                  <input type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleChange} className="h-5 w-5 mt-1 accent-[#2563eb] border-gray-300 rounded" required />
                  <label className="text-sm text-gray-700 font-medium">
                    I agree to be contacted regarding my appointment.
                  </label>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center pt-4">
                  <button type="submit" disabled={isSubmitting || isFormIncomplete} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
                    {isSubmitting ? 'Booking Appointment...' : 'Book Appointment'}
                  </button>
                </motion.div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Appointment;
