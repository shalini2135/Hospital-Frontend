import React, { useState, useEffect } from "react";
import { markAppointmentCompleted } from '../../services/DoctorPanel/AppointmentService';

const PrescriptionForm = ({ appointmentId, doctorId, patientId, patientName, onClose, onSuccess }) => {
  // Medicine search and management
  const [search, setSearch] = useState("");
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Injection search and management
  const [injections, setInjections] = useState([]);
  const [injectionSearch, setInjectionSearch] = useState("");
  const [showInjectionSuggestions, setShowInjectionSuggestions] = useState(false);
  
  // Additional prescription data
  const [dietPlan, setDietPlan] = useState("");
  const [recommendedTests, setRecommendedTests] = useState([]);
  
  // UI state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Medicine data
  const [allMedicines, setAllMedicines] = useState([]);

  const testOptions = [
    "Blood Test", "ECG", "Chest X-Ray", "Urine Test", "MRI Scan", 
    "CT Scan", "Complete Blood Count", "Lipid Profile", 
    "Liver Function Test", "Kidney Function Test"
  ];

  // Debug logs
  useEffect(() => {
    console.log("PrescriptionForm props:", { appointmentId, doctorId, patientId, patientName });
  }, [appointmentId, doctorId, patientId, patientName]);

  // Fetch medicines from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pharmacy-backend-r88x.onrender.com/api/medicines');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched medicines:", data.length, "items");
        setAllMedicines(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setError('Failed to load medicines from server');
        setAllMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Separate medicines and injections based on batch prefix
  const medicines = allMedicines.filter(med => 
    med.batch && med.batch.toUpperCase().startsWith('B')
  );
  
  const availableInjections = allMedicines.filter(med => 
    med.batch && med.batch.toUpperCase().startsWith('I')
  );

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const validatePrescriptionData = () => {
    if (!patientId || !patientName) {
      showToast("Patient information is missing. Please close and retry.", "error");
      return false;
    }

    if (!appointmentId || !doctorId) {
      showToast("Appointment or doctor information is missing.", "error");
      return false;
    }

    if (selectedMeds.length === 0 && injections.length === 0 && !dietPlan.trim() && recommendedTests.length === 0) {
      showToast("Please add at least one medicine, injection, diet plan, or test recommendation", "error");
      return false;
    }

    return true;
  };

  const preparePrescriptionData = () => ({
    appointmentId,
    doctorId,
    patientId,
    patientName,
    medicines: selectedMeds.map(med => ({
      name: med.name,
      batch: med.batch,
      dosage: med.dosage || "",
      quantity: med.quantity || "",
      duration: med.duration || "",
      timing: med.timing || []
    })),
    injections: injections.map(inj => ({
      name: inj.name,
      batch: inj.batch,
      dosage: inj.dosage || "",
      quantity: inj.quantity || "",
      schedule: inj.schedule || "",
      notes: inj.notes || ""
    })),
    dietPlan,
    recommendedTests
  });

  const savePrescription = async (prescriptionData) => {
    const response = await fetch('https://doctorpanel-backend.onrender.com/api/prescriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(prescriptionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) errorMessage = errorData.message;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  const completeAppointment = async () => {
    try {
      const completionResult = await markAppointmentCompleted(appointmentId);
      console.log('Appointment marked as completed:', completionResult.data);
      return true;
    } catch (completionError) {
      console.warn('Error marking appointment as completed:', completionError);
      
      if (completionError.response?.status === 404) {
        console.warn(`Appointment ${appointmentId} not found in appointment service`);
        showToast("Prescription saved successfully! (Appointment status update may require manual refresh)");
      } else {
        showToast("Prescription saved successfully!");
      }
      return false;
    }
  };

  const handleSavePrescription = async () => {
    if (!validatePrescriptionData()) return;

    try {
      setSubmitting(true);
      console.log("Creating prescription...");

      const prescriptionData = preparePrescriptionData();
      console.log('Sending prescription data:', JSON.stringify(prescriptionData, null, 2));

      // Save prescription
      const prescriptionResult = await savePrescription(prescriptionData);
      console.log('Prescription saved successfully:', prescriptionResult);
      
      // Complete appointment
      const appointmentCompleted = await completeAppointment();
      
      if (appointmentCompleted) {
        showToast("Prescription saved and appointment completed successfully!");
      }
      
      // Call success callback
      if (onSuccess) {
        console.log("Calling onSuccess callback");
        onSuccess(prescriptionResult);
      }

    } catch (error) {
      console.error('Error saving prescription:', error);
      
      let errorMessage = error.message;
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error - unable to connect to server. Please check your internet connection.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error - please check server configuration.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout - server took too long to respond.';
      }
      
      showToast(`Error saving prescription: ${errorMessage}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Medicine search and management functions
  const filteredSuggestions = medicines.filter(med =>
    med.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const filteredInjectionSuggestions = availableInjections.filter(inj =>
    inj.name.toLowerCase().includes(injectionSearch.trim().toLowerCase())
  );

  const handleAddMedicine = (med) => {
    const exists = selectedMeds.find(m => m.name.toLowerCase() === med.name.toLowerCase());
    if (!exists) {
      setSelectedMeds([
        ...selectedMeds,
        { 
          ...med, 
          timing: [], 
          duration: "", 
          quantity: "", 
          dosage: med.dosage || "",
          batch: med.batch || ""
        },
      ]);
    }
    setSearch("");
    setShowSuggestions(false);
  };

  const handleAddInjectionFromSearch = (injection) => {
    setInjections([
      ...injections,
      { 
        ...injection,
        schedule: "", 
        notes: "",
        quantity: "",
        batch: injection.batch || ""
      },
    ]);
    setInjectionSearch("");
    setShowInjectionSuggestions(false);
  };

  const handleRemoveMedicine = (indexToRemove) => {
    setSelectedMeds(selectedMeds.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveInjection = (indexToRemove) => {
    setInjections(injections.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTimingChange = (index, time) => {
    const updated = [...selectedMeds];
    const current = updated[index].timing;
    if (current.includes(time)) {
      updated[index].timing = current.filter(t => t !== time);
    } else {
      updated[index].timing = [...current, time];
    }
    setSelectedMeds(updated);
  };

  const updateMedField = (index, field, value) => {
    const updated = [...selectedMeds];
    updated[index][field] = value;
    setSelectedMeds(updated);
  };

  const updateInjection = (index, field, value) => {
    const updated = [...injections];
    updated[index][field] = value;
    setInjections(updated);
  };

  const handleTestToggle = (testName) => {
    setRecommendedTests(prev =>
      prev.includes(testName)
        ? prev.filter(t => t !== testName)
        : [...prev, testName]
    );
  };

  const clearSearch = (type) => {
    if (type === 'medicine') {
      setSearch("");
      setShowSuggestions(false);
    } else {
      setInjectionSearch("");
      setShowInjectionSuggestions(false);
    }
  };

  const handleSearchAdd = (type) => {
    if (type === 'medicine') {
      const found = medicines.find(m => m.name.toLowerCase() === search.trim().toLowerCase());
      if (found) {
        handleAddMedicine(found);
      } else {
        showToast("Medicine not found", "error");
      }
    } else {
      const found = availableInjections.find(inj => inj.name.toLowerCase() === injectionSearch.trim().toLowerCase());
      if (found) {
        handleAddInjectionFromSearch(found);
      } else {
        showToast("Injection not found", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <h2 className="text-2xl font-bold">Loading Medicines...</h2>
          </div>
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {toast.type === 'success' ? (
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            {toast.message}
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
          <h2 className="text-2xl font-bold">Create Prescription</h2>
          <p className="text-blue-100 text-sm mt-1">
            Appointment ID: {appointmentId} • Doctor ID: {doctorId}
          </p>
          <p className="text-blue-100 text-sm">
            {medicines.length} medicines • {availableInjections.length} injections available
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">

            {/* Search Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Medicine Search */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Add Medicines (Batch: B*)
                </h3>
                <div className="relative">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search medicine..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setShowSuggestions(true);
                        }}
                        className="border-2 border-gray-200 px-4 py-3 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {search && (
                        <button
                          onClick={() => clearSearch('medicine')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleSearchAdd('medicine')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>

                  {showSuggestions && search.trim() && filteredSuggestions.length > 0 && (
                    <ul className="absolute bg-white border-2 border-gray-100 rounded-lg mt-2 shadow-xl z-50 max-h-40 overflow-auto w-full">
                      {filteredSuggestions.map((med, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
                          onClick={() => handleAddMedicine(med)}
                        >
                          <div className="font-semibold text-gray-800">{med.name}</div>
                          <div className="text-sm text-gray-500">
                            {med.type || 'Medicine'} • Batch: {med.batch} • {med.dosage || 'No dosage specified'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Injection Search */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Add Injections (Batch: I*)
                </h3>
                <div className="relative">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search injection..."
                        value={injectionSearch}
                        onChange={(e) => {
                          setInjectionSearch(e.target.value);
                          setShowInjectionSuggestions(true);
                        }}
                        className="border-2 border-gray-200 px-4 py-3 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {injectionSearch && (
                        <button
                          onClick={() => clearSearch('injection')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleSearchAdd('injection')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>

                  {showInjectionSuggestions && injectionSearch.trim() && filteredInjectionSuggestions.length > 0 && (
                    <ul className="absolute bg-white border-2 border-gray-100 rounded-lg mt-2 shadow-xl z-50 max-h-40 overflow-auto w-full">
                      {filteredInjectionSuggestions.map((inj, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
                          onClick={() => handleAddInjectionFromSearch(inj)}
                        >
                          <div className="font-semibold text-gray-800">{inj.name}</div>
                          <div className="text-sm text-gray-500">
                            Injection • Batch: {inj.batch} • {inj.dosage || 'No dosage specified'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Prescribed Items Table */}
            {(selectedMeds.length > 0 || injections.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Prescribed Items
                </h3>
                <div className="border-2 border-gray-200 rounded-xl overflow-x-auto bg-gray-50 shadow-sm">
                  <table className="w-full text-sm min-w-[900px]">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Batch</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Dosage</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Qty</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration/Schedule</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Timing/Notes</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      
                      {/* Medicine Rows */}
                      {selectedMeds.map((med, index) => (
                        <tr key={`med-${index}`} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Med</span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Medicine Name"
                              value={med.name}
                              onChange={(e) => updateMedField(index, "name", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm font-semibold text-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {med.batch || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="e.g., 500mg"
                              value={med.dosage || ''}
                              onChange={(e) => updateMedField(index, "dosage", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              placeholder="e.g., 10"
                              value={med.quantity}
                              onChange={(e) => updateMedField(index, "quantity", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              placeholder="e.g., 5 (days)"
                              value={med.duration}
                              onChange={(e) => updateMedField(index, "duration", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {["Morning", "Afternoon", "Night"].map((time) => (
                                <label key={time} className="flex items-center gap-1 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={med.timing.includes(time)}
                                    onChange={() => handleTimingChange(index, time)}
                                    className="w-4 h-4 rounded"
                                  />
                                  {time.charAt(0)}
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveMedicine(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors"
                              title="Remove"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Injection Rows */}
                      {injections.map((inj, index) => (
                        <tr key={`inj-${index}`} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Inj</span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Injection Name"
                              value={inj.name}
                              onChange={(e) => updateInjection(index, "name", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm font-semibold text-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {inj.batch || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="e.g., 2ml"
                              value={inj.dosage || ''}
                              onChange={(e) => updateInjection(index, "dosage", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              placeholder="e.g., 2"
                              value={inj.quantity}
                              onChange={(e) => updateInjection(index, "quantity", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="e.g., Daily for 3 days"
                              value={inj.schedule}
                              onChange={(e) => updateInjection(index, "schedule", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <textarea
                              placeholder="Any special instructions..."
                              value={inj.notes}
                              onChange={(e) => updateInjection(index, "notes", e.target.value)}
                              className="w-full border border-gray-200 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                              rows={1}
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveInjection(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors"
                              title="Remove"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Diet Plan and Tests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Diet Plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Diet Plan
                </h3>
                <textarea
                  placeholder="Diet recommendations..."
                  value={dietPlan}
                  onChange={(e) => setDietPlan(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                  rows={4}
                />
              </div>

              {/* Tests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Recommended Tests
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {testOptions.map((test) => (
                    <label key={test} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                      <input
                        type="checkbox"
                        checked={recommendedTests.includes(test)}
                        onChange={() => handleTestToggle(test)}
                        className="rounded w-5 h-5 text-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{test}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="bg-gray-100 px-8 py-6 flex justify-end gap-4 border-t-2 border-gray-200">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleSavePrescription}
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
            ) : (
              'Save Prescription'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;