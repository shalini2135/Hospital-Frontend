import React, { useState } from "react";
import { User, Phone, Mail, MapPin, Plus, X } from "lucide-react";
import { registerUser, registerPatientDetails } from "./api";
// Mock toast implementation since react-toastify isn't available in this environment
const toast = {
  success: (message, options) => {
    console.log('SUCCESS:', message);
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, options?.autoClose || 5000);
  },
  error: (message, options) => {
    console.log('ERROR:', message);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, options?.autoClose || 7000);
  },
  info: (message) => {
    console.log('INFO:', message);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
  },
  loading: (message) => {
    console.log('LOADING:', message);
    const notification = document.createElement('div');
    notification.id = 'loading-toast';
    notification.className = 'fixed top-4 right-4 bg-gray-600 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    return 'loading-toast';
  },
  dismiss: (id) => {
    const notification = document.getElementById(id);
    if (notification) {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }
};



// Password encryption function using Web Crypto API
const encryptPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "healthcare_salt_2024"); // Add salt
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const Signup = ({ onClose, onLoginClick }) => {
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "", phone: "", relation: "", email: "" },
  ]);

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    dateOfBirth: "",
    bloodGroup: "",
    gender: "",
    maritalStatus: "",
    city: "",
    state: "",
    zipCode: "",
    contactNumber: "",
    patientEmail: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEmergencyContact = () => {
    const newId = Math.max(...emergencyContacts.map((c) => c.id), 0) + 1;
    setEmergencyContacts([
      ...emergencyContacts,
      {
        id: newId,
        name: "",
        phone: "",
        relation: "",
        email: "",
      },
    ]);
  };

  const removeEmergencyContact = (id) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(
        emergencyContacts.filter((contact) => contact.id !== id)
      );
    }
  };

  const updateEmergencyContact = (id, field, value) => {
    setEmergencyContacts(
      emergencyContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const clearForm = () => {
    setFormData({
      patientName: "",
      age: "",
      dateOfBirth: "",
      bloodGroup: "",
      gender: "",
      maritalStatus: "",
      city: "",
      state: "",
      zipCode: "",
      contactNumber: "",
      patientEmail: "",
      password: "",
      address: "",
    });
    setEmergencyContacts([
      { id: 1, name: "", phone: "", relation: "", email: "" },
    ]);
    setErrors({});
    toast.info("Form cleared successfully!");
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 10 || formData.age > 70) {
      newErrors.age = "Age must be between 1 and 120";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      // Validate date of birth is not in the future
      const today = new Date();
      const dob = new Date(formData.dateOfBirth);
      if (dob > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }
    
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (formData.contactNumber.length < 10) {
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    }
    
    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.patientEmail)) {
        newErrors.patientEmail = "Please enter a valid email address";
      }
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    // Validate form first
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToastId = toast.loading("Registering patient...");

    try {
      // Encrypt password before sending
      
      const encryptedPassword = await encryptPassword(formData.password);
      // Prepare the data according to your backend Patient model
      const patientData = {
        patientName: formData.patientName,
        age: parseInt(formData.age),
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus || null,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode || "",
        contactNumber: formData.contactNumber,
        patientEmail: formData.patientEmail,
        password: encryptedPassword, // Send encrypted password
        address: formData.address,
        emergencyContacts: emergencyContacts.filter(
          (contact) =>
            contact.name.trim() ||
            contact.phone.trim() ||
            contact.relation.trim() ||
            contact.email.trim()
        ),
      };

      // Make API call to your backend

      const response = await fetch('https://patient-service-ntk0.onrender.com/api/patient/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });


      const result = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      if (response.ok && result.success) {
        
      const authResponse = await registerUser({
        username: result.data.patientName,
        email: formData.patientEmail,
        password: formData.password,
        userId:result.data.patientId
      });
      console.log('Auth response:', authResponse);
         localStorage.setItem("ides",result.data.patientId );
        toast.success(`Patient registered successfully! Patient ID: ${result.data.patientId}`, {
          autoClose: 5000,
        });
        

        // Clear the form after successful registration
        clearForm();
        
        // Close the modal after a short delay to let user see the success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {

        toast.error(`Registration failed: ${result.message || 'Unknown error'}`, {
          autoClose: 7000,
        });
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      console.error('Error registering patient:', error);
      toast.error('Registration failed: Network error or server is not responding', {
        autoClose: 7000,
      });
       console.error('Registration error:', error);
      toast.error(`Authentication registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);

    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="text-gray-600 mt-1">
                Sign up with your details to get started
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Personal Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Details
            </h3>

            <div className="space-y-6">
              {/* Row 1 - Patient Name, Age, and Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.patientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.patientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    min="1"
                    max="120"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
              </div>

              {/* Row 2 - Blood Group, Gender, Marital Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && (
                    <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select marital status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Row 3 - City, State, Zip Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Enter zip code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 4 - Contact Number, Email, Password */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter contact number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    placeholder="Enter email address"
                    value={formData.patientEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.patientEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.patientEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.patientEmail}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Phone size={20} className="text-blue-600" />
              Emergency Contact Information
            </h3>

            {emergencyContacts.map((contact, index) => (
              <div
                key={contact.id}
                className={`border border-gray-200 rounded-lg p-5 mb-4 bg-white ${
                  index > 0 ? "mt-4" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-blue-600">
                    Emergency Contact {index + 1}
                  </h4>
                  {emergencyContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmergencyContact(contact.id)}
                      disabled={isSubmitting}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove Contact
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Emergency contact name"
                        value={contact.name}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "name",
                            e.target.value
                          )
                        }
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Emergency contact phone"
                        value={contact.phone}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "phone",
                            e.target.value
                          )
                        }
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Relationship (e.g., Mother, Father, Spouse)"
                        value={contact.relation}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "relation",
                            e.target.value
                          )
                        }
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Emergency contact email"
                        value={contact.email}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "email",
                            e.target.value
                          )
                        }
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <button
                type="button"
                onClick={addEmergencyContact}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={16} />
                Add Another Contact
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={clearForm}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                'REGISTER PATIENT'
              )}
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              disabled={isSubmitting}
              className="text-blue-600 hover:text-blue-800 underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;