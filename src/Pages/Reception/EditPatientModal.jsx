import React, { useState, useEffect } from 'react';
import { X, Edit, User, MapPin, Phone, Save, Loader2, CheckCircle, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';

// Mock toast implementation
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
  }
};

const EditPatientModal = ({
  isOpen,
  onClose,
  patient,
  onSave,
  isSubmitting,
  submitStatus,
  onVerifyOldPassword // New prop for verifying old password
}) => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    city: '',
    state: '',
    zipCode: '',
    address: '',
    patientEmail: '',
    contactNumber: '',
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: '', phone: '', relation: '', email: '' }
  ]);

  const [errors, setErrors] = useState({});
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [oldPasswordVerified, setOldPasswordVerified] = useState(false);

  // Initialize form data when patient changes
  useEffect(() => {
    if (patient) {
      setFormData({
        patientId: patient.id || '',
        patientName: patient.name || '',
        age: patient.age || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        bloodGroup: patient.bloodGroup || '',
        maritalStatus: patient.maritalStatus || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zipCode || '',
        address: patient.rawAddress || patient.address || '',
        patientEmail: patient.patientEmail || '',
        contactNumber: patient.contactNumber || '',
      });

      // Set emergency contacts
      if (patient.emergencyContacts && patient.emergencyContacts.length > 0) {
        const contacts = patient.emergencyContacts.map((contact, index) => ({
          id: index + 1,
          name: contact.name || '',
          phone: contact.phone || '',
          relation: contact.relation || '',
          email: contact.email || ''
        }));
        setEmergencyContacts(contacts);
      } else {
        setEmergencyContacts([{ id: 1, name: '', phone: '', relation: '', email: '' }]);
      }

      // Reset password change state
      setShowPasswordChange(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      setOldPasswordVerified(false);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePasswordClick = () => {
    setShowPasswordChange(true);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setOldPasswordVerified(false);
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordChange(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setOldPasswordVerified(false);
  };

  const verifyOldPassword = async () => {
    if (!passwordData.oldPassword.trim()) {
      setPasswordErrors({ oldPassword: 'Please enter your current password' });
      return;
    }

    setIsVerifyingPassword(true);
    setPasswordErrors({});

    try {
      // Mock verification - replace with actual API call
      const isValid = await mockVerifyPassword(patient.id, passwordData.oldPassword);
      
      if (isValid) {
        setOldPasswordVerified(true);
        toast.success('Current password verified successfully');
      } else {
        setPasswordErrors({ oldPassword: 'Current password is incorrect' });
      }
    } catch (error) {
      setPasswordErrors({ oldPassword: 'Error verifying password. Please try again.' });
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // Mock function to verify old password - replace with actual API call
  const mockVerifyPassword = async (patientId, oldPassword) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification logic - replace with actual verification
    // For demo purposes, assume password is correct if it's not empty
    return oldPassword.length >= 6;
  };

  const validatePasswordChange = () => {
    const newPasswordErrors = {};

    if (!passwordData.newPassword) {
      newPasswordErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newPasswordErrors.newPassword = 'Password must be at least 6 characters long';
    } else if (passwordData.newPassword === passwordData.oldPassword) {
      newPasswordErrors.newPassword = 'New password must be different from current password';
    }

    if (!passwordData.confirmPassword) {
      newPasswordErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newPasswordErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newPasswordErrors);
    return Object.keys(newPasswordErrors).length === 0;
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

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
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

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Validate password change if it's being changed
    if (showPasswordChange && oldPasswordVerified && !validatePasswordChange()) {
      toast.error("Please fix the password errors before saving");
      return;
    }

    // Prepare data for save
    const dataToSave = {
      ...formData,
      emergencyContacts: emergencyContacts.filter(contact =>
        contact.name.trim() || contact.phone.trim() || contact.relation.trim() || contact.email.trim()
      )
    };

    // Include new password if it's being changed
    if (showPasswordChange && oldPasswordVerified && passwordData.newPassword) {
      dataToSave.newPassword = passwordData.newPassword;
    }

    onSave(dataToSave);
  };

  // Styling functions
  const getInputStyle = (fieldName) => ({
    width: "100%",
    padding: "12px 16px",
    border: `1px solid ${errors[fieldName] || passwordErrors[fieldName] ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    opacity: isSubmitting ? 0.5 : 1,
    cursor: isSubmitting ? 'not-allowed' : 'text',
  });

  const getPasswordInputStyle = (fieldName) => ({
    width: "100%",
    padding: "12px 16px",
    paddingRight: "48px",
    border: `1px solid ${passwordErrors[fieldName] ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
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

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ffffff",
    color: "#3b82f6",
    marginRight: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  };

  const changePasswordButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    fontSize: "13px",
    padding: "10px 20px",
    textTransform: "none",
    letterSpacing: "normal",
  };

  const verifyButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#059669",
    color: "#ffffff",
    fontSize: "13px",
    padding: "10px 20px",
    textTransform: "none",
    letterSpacing: "normal",
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

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "32px",
  };

  const passwordContainerStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "24px",
    backgroundColor: "#f8fafc",
    marginTop: "20px",
  };

  const passwordInputContainerStyle = {
    position: "relative",
    marginBottom: "16px",
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    padding: "4px",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Edit className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Edit Patient Information</h2>
              <p className="text-blue-100 text-sm">Patient ID: {formData.patientId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-lg p-2 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc" }}>
          {/* Success/Error Status */}
          {submitStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              submitStatus === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {submitStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {submitStatus === 'success'
                  ? 'Patient information updated successfully!'
                  : 'There was an error processing your request. Please check the form and try again.'
                }
              </span>
            </div>
          )}

          {/* Personal Details Section */}
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
                <label style={labelStyle}>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Enter ZIP code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={getInputStyle('zipCode')}
                  disabled={isSubmitting}
                  required
                />
                {errors.zipCode && (
                  <span style={errorTextStyle}>{errors.zipCode}</span>
                )}
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
                <label style={labelStyle}>Security</label>
                <button
                  type="button"
                  onClick={handleChangePasswordClick}
                  style={changePasswordButtonStyle}
                  disabled={isSubmitting}
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Password Change Section */}
            {showPasswordChange && (
              <div style={passwordContainerStyle}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px"
                }}>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    margin: 0
                  }}>
                    Change Password
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6b7280",
                      cursor: "pointer",
                      padding: "4px",
                      fontSize: "12px"
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {!oldPasswordVerified ? (
                  // Step 1: Verify old password
                  <div>
                    <div style={passwordInputContainerStyle}>
                      <label style={labelStyle}>Current Password *</label>
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        name="oldPassword"
                        placeholder="Enter your current password"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        style={getPasswordInputStyle('oldPassword')}
                        disabled={isVerifyingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('old')}
                        style={eyeButtonStyle}
                        disabled={isVerifyingPassword}
                      >
                        {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {passwordErrors.oldPassword && (
                        <span style={errorTextStyle}>{passwordErrors.oldPassword}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={verifyOldPassword}
                      style={verifyButtonStyle}
                      disabled={isVerifyingPassword || !passwordData.oldPassword.trim()}
                    >
                      {isVerifyingPassword ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid transparent',
                            borderTop: '2px solid currentColor',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Verifying...
                        </>
                      ) : (
                        'Verify Current Password'
                      )}
                    </button>
                  </div>
                ) : (
                  // Step 2: Enter new password and confirm
                  <div>
                    <div style={{
                      backgroundColor: "#dcfce7",
                      border: "1px solid #16a34a",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span style={{ fontSize: "14px", color: "#166534" }}>
                        Current password verified successfully. Now enter your new password.
                      </span>
                    </div>

                    <div style={passwordInputContainerStyle}>
                      <label style={labelStyle}>New Password *</label>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter new password (min 6 characters)"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        style={getPasswordInputStyle('newPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        style={eyeButtonStyle}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {passwordErrors.newPassword && (
                        <span style={errorTextStyle}>{passwordErrors.newPassword}</span>
                      )}
                    </div>

                    <div style={passwordInputContainerStyle}>
                      <label style={labelStyle}>Confirm New Password *</label>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        style={getPasswordInputStyle('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        style={eyeButtonStyle}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {passwordErrors.confirmPassword && (
                        <span style={errorTextStyle}>{passwordErrors.confirmPassword}</span>
                      )}
                    </div>

                    <div style={{
                      backgroundColor: "#fef3c7",
                      border: "1px solid #f59e0b",
                      borderRadius: "8px",
                      padding: "12px",
                      marginTop: "16px"
                    }}>
                      <p style={{ fontSize: "12px", color: "#92400e", margin: 0 }}>
                        <strong>Password Requirements:</strong>
                      </p>
                      <ul style={{ fontSize: "12px", color: "#92400e", margin: "4px 0 0 16px", padding: 0 }}>
                        <li>At least 6 characters long</li>
                        <li>Different from your current password</li>
                        <li>Both password fields must match</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

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

          {/* Emergency Contact Section */}
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

          {/* Action Buttons */}
          <div style={buttonContainerStyle}>
            <button
              style={cancelButtonStyle}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              style={saveButtonStyle}
              onClick={handleSave}
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
                'UPDATE PATIENT'
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
      </div>
    </div>
  );
};

export default EditPatientModal;