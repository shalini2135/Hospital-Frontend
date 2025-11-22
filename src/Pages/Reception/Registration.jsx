import React, { useState } from "react";

// Mock toast implementation since react-toastify isn't available in this environment
const toast = {
  success: (message, options) => {
    console.log('SUCCESS:', message);
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
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const PatientRegistrationForm = () => {
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

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "", phone: "", relation: "", email: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmergencyContactChange = (id, field, value) => {
    setEmergencyContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const addEmergencyContact = () => {
    const newId = Math.max(...emergencyContacts.map((c) => c.id), 0) + 1;
    setEmergencyContacts((prev) => [
      ...prev,
      { id: newId, name: "", phone: "", relation: "", email: "" },
    ]);
  };

  const removeEmergencyContact = (id) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts((prev) =>
        prev.filter((contact) => contact.id !== id)
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 1 || formData.age > 120) {
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

  const handleClearForm = () => {
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

  const handleRegisterPatient = async () => {
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
        emergencyContacts: emergencyContacts.filter(contact => 
          contact.name.trim() || contact.phone.trim() || contact.relation.trim() || contact.email.trim()
        )
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
        toast.success(`Patient registered successfully! Patient ID: ${result.data.patientId}`, {
          autoClose: 5000,
        });
        // Clear the form after successful registration
        handleClearForm();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (fieldName) => ({
    width: "100%",
    padding: "12px 16px",
    border: `1px solid ${errors[fieldName] ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    opacity: isSubmitting ? 0.5 : 1,
    cursor: isSubmitting ? 'not-allowed' : 'text',
  });

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
    fontFamily: "Arial, sans-serif",
  };

  const errorTextStyle = {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
  };

  const sectionStyle = {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  };

  const sectionTitleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: "24px",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "8px",
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  };

  const columnStyle = {
    flex: 1,
  };

  const fullWidthStyle = {
    width: "100%",
    marginBottom: "20px",
  };

  const getTextareaStyle = (fieldName) => ({
    ...getInputStyle(fieldName),
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  });

  const buttonStyle = {
    padding: "14px 28px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    opacity: isSubmitting ? 0.6 : 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
  };

  const clearButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ffffff",
    color: "#3b82f6",
    marginRight: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const registerButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  };

  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8fafc",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "32px",
  };

  const addContactButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    marginTop: "20px",
    alignSelf: "flex-start",
    fontSize: "13px",
    padding: "10px 20px",
  };

  const removeContactButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ef4444",
    color: "#ffffff",
    fontSize: "12px",
    padding: "8px 16px",
    marginLeft: "12px",
  };

  const contactContainerStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
    backgroundColor: "#f9fafb",
  };

  const contactHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  };

  const contactTitleStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e40af",
  };

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Personal Details</h2>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <label style={labelStyle}>Patient Name *</label>
            <input
              type="text"
              name="patientName"
              placeholder="Enter patient name"
              value={formData.patientName}
              onChange={handleInputChange}
              style={getInputStyle('patientName')}
              disabled={isSubmitting}
              required
            />
            {errors.patientName && (
              <span style={errorTextStyle}>{errors.patientName}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Age *</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleInputChange}
              style={getInputStyle('age')}
              disabled={isSubmitting}
              min="1"
              max="120"
              required
            />
            {errors.age && (
              <span style={errorTextStyle}>{errors.age}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              style={getInputStyle('dateOfBirth')}
              disabled={isSubmitting}
              required
            />
            {errors.dateOfBirth && (
              <span style={errorTextStyle}>{errors.dateOfBirth}</span>
            )}
          </div>
        </div>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <label style={labelStyle}>Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              style={getInputStyle('bloodGroup')}
              disabled={isSubmitting}
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
              <span style={errorTextStyle}>{errors.bloodGroup}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={getInputStyle('gender')}
              disabled={isSubmitting}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span style={errorTextStyle}>{errors.gender}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              style={getInputStyle('maritalStatus')}
              disabled={isSubmitting}
            >
              <option value="">Select marital status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <label style={labelStyle}>City *</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleInputChange}
              style={getInputStyle('city')}
              disabled={isSubmitting}
              required
            />
            {errors.city && (
              <span style={errorTextStyle}>{errors.city}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>State *</label>
            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleInputChange}
              style={getInputStyle('state')}
              disabled={isSubmitting}
              required
            />
            {errors.state && (
              <span style={errorTextStyle}>{errors.state}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              placeholder="Enter zip code"
              value={formData.zipCode}
              onChange={handleInputChange}
              style={getInputStyle('zipCode')}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <label style={labelStyle}>Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter contact number"
              value={formData.contactNumber}
              onChange={handleInputChange}
              style={getInputStyle('contactNumber')}
              disabled={isSubmitting}
              required
            />
            {errors.contactNumber && (
              <span style={errorTextStyle}>{errors.contactNumber}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              name="patientEmail"
              placeholder="Enter email address"
              value={formData.patientEmail}
              onChange={handleInputChange}
              style={getInputStyle('patientEmail')}
              disabled={isSubmitting}
              required
            />
            {errors.patientEmail && (
              <span style={errorTextStyle}>{errors.patientEmail}</span>
            )}
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              style={getInputStyle('password')}
              disabled={isSubmitting}
              required
            />
            {errors.password && (
              <span style={errorTextStyle}>{errors.password}</span>
            )}
          </div>
        </div>
        <div style={fullWidthStyle}>
          <label style={labelStyle}>Address *</label>
          <textarea
            name="address"
            placeholder="Enter full address"
            value={formData.address}
            onChange={handleInputChange}
            style={getTextareaStyle('address')}
            disabled={isSubmitting}
            required
          />
          {errors.address && (
            <span style={errorTextStyle}>{errors.address}</span>
          )}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          Emergency Contact & Medical Information
        </h2>
        {emergencyContacts.map((contact, index) => (
          <div key={contact.id} style={contactContainerStyle}>
            <div style={contactHeaderStyle}>
              <span style={contactTitleStyle}>
                Emergency Contact {index + 1}
              </span>
              {emergencyContacts.length > 1 && (
                <button
                  style={removeContactButtonStyle}
                  onClick={() => removeEmergencyContact(contact.id)}
                  disabled={isSubmitting}
                >
                  Remove Contact
                </button>
              )}
            </div>
            <div style={rowStyle}>
              <div style={columnStyle}>
                <label style={labelStyle}>Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="Enter emergency contact name"
                  value={contact.name}
                  onChange={(e) =>
                    handleEmergencyContactChange(
                      contact.id,
                      "name",
                      e.target.value
                    )
                  }
                  style={getInputStyle('')}
                  disabled={isSubmitting}
                />
              </div>
              <div style={columnStyle}>
                <label style={labelStyle}>Emergency Contact Phone</label>
                <input
                  type="tel"
                  placeholder="Enter emergency contact phone"
                  value={contact.phone}
                  onChange={(e) =>
                    handleEmergencyContactChange(
                      contact.id,
                      "phone",
                      e.target.value
                    )
                  }
                  style={getInputStyle('')}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div style={rowStyle}>
              <div style={columnStyle}>
                <label style={labelStyle}>Relationship</label>
                <input
                  type="text"
                  placeholder="e.g., Mother, Father, Spouse"
                  value={contact.relation}
                  onChange={(e) =>
                    handleEmergencyContactChange(
                      contact.id,
                      "relation",
                      e.target.value
                    )
                  }
                  style={getInputStyle('')}
                  disabled={isSubmitting}
                />
              </div>
              <div style={columnStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="Enter emergency contact email"
                  value={contact.email}
                  onChange={(e) =>
                    handleEmergencyContactChange(
                      contact.id,
                      "email",
                      e.target.value
                    )
                  }
                  style={getInputStyle('')}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        ))}
        <button 
          style={addContactButtonStyle} 
          onClick={addEmergencyContact}
          disabled={isSubmitting}
        >
          Add Another Contact
        </button>
      </div>

      <div style={buttonContainerStyle}>
        <button 
          style={clearButtonStyle} 
          onClick={handleClearForm}
          disabled={isSubmitting}
        >
          Clear Form
        </button>
        <button 
          style={registerButtonStyle} 
          onClick={handleRegisterPatient}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Processing...
            </>
          ) : (
            'REGISTER PATIENT'
          )}
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PatientRegistrationForm;