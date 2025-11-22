import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Eye, Trash2, Phone, Mail, MapPin, X, User, Calendar, Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import ViewPatientModal from './ViewPatientModal';
import EditPatientModal from './EditPatientModal';

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

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isViewPatientOpen, setIsViewPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Form states
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // API base URL
  const API_BASE_URL = 'https://patient-service-ntk0.onrender.com/api/patient';

  // Helper function to format date correctly
  const formatDateToLocal = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Transform backend data to frontend format
  const transformPatientData = (patientData) => {
    return patientData.map(patient => ({
      id: patient.patientId,
      name: patient.patientName,
      age: patient.age,
      gender: patient.gender,
      phone: patient.emergencyContacts?.[0]?.phone || 'N/A',
      email: patient.emergencyContacts?.[0]?.email || 'N/A',
      address: `${patient.address}, ${patient.city}, ${patient.state} ${patient.zipCode}`,
      registrationDate: formatDateToLocal(patient.createdAt),
      lastVisit: formatDateToLocal(patient.updatedAt),
      bloodGroup: patient.bloodGroup,
      emergencyContact: patient.emergencyContacts?.[0]?.phone || 'N/A',
      maritalStatus: patient.maritalStatus,
      city: patient.city,
      state: patient.state,
      zipCode: patient.zipCode,
      rawAddress: patient.address,
      emergencyContacts: patient.emergencyContacts || [],
      contactNumber: patient.contactNumber || 'N/A',
      patientEmail: patient.patientEmail || 'N/A',
      password: patient.password || ''
    }));
  };

  // Fetch all patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get`);
      const data = await response.json();
      
      if (data.success) {
        const transformedPatients = transformPatientData(data.data);
        setAllPatients(transformedPatients);
        setPatients(transformedPatients);
        setError(null);
      } else {
        setError('Failed to fetch patients');
        toast.error('Failed to fetch patients from server');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Error connecting to server');
      toast.error('Error connecting to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Local search filter effect
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setPatients(allPatients);
    } else {
      const filtered = allPatients.filter(patient => {
        const term = searchTerm.toLowerCase();
        return (
          patient.name.toLowerCase().includes(term) ||
          patient.id.toLowerCase().includes(term) ||
          patient.phone.includes(term) ||
          patient.contactNumber.includes(term) ||
          patient.patientEmail.toLowerCase().includes(term) ||
          patient.city.toLowerCase().includes(term) ||
          patient.bloodGroup.toLowerCase().includes(term)
        );
      });
      setPatients(filtered);
      
      if (searchTerm.trim() !== '') {
        toast.info(`Found ${filtered.length} patients matching "${searchTerm}"`);
      }
    }
  }, [searchTerm, allPatients]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsViewPatientOpen(true);
    toast.info(`Viewing patient record: ${patient.name}`);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditPatientOpen(true);
    setSubmitStatus(null);
    toast.info(`Editing patient: ${patient.name}`);
  };

  const handleSavePatient = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      
      // Clean up emergency contacts
      const cleanedEmergencyContacts = formData.emergencyContacts
        ? formData.emergencyContacts
            .filter(contact => 
              (contact.phone && contact.phone.trim() !== '') || 
              (contact.email && contact.email.trim() !== '')
            )
            .map(contact => ({
              name: contact.name?.trim() || '',
              relation: contact.relation?.trim() || '',
              email: contact.email?.trim() || '',
              phone: contact.phone?.trim() || ''
            }))
        : [];

      // Prepare the data to send to backend
      const dataToSend = {
        patientId: formData.patientId,
        patientName: formData.patientName?.trim(),
        age: parseInt(formData.age) || 0,
        gender: formData.gender?.trim(),
        bloodGroup: formData.bloodGroup?.trim(),
        address: formData.address?.trim(),
        city: formData.city?.trim(),
        state: formData.state?.trim(),
        zipCode: formData.zipCode?.trim() || '',
        emergencyContacts: cleanedEmergencyContacts,
        password: formData.password || selectedPatient.password || 'keepExisting',
        patientEmail: formData.patientEmail?.trim(),
        contactNumber: formData.contactNumber?.trim()
      };

      if (formData.maritalStatus && formData.maritalStatus.trim() !== '') {
        dataToSend.maritalStatus = formData.maritalStatus.trim();
      }

      console.log('Sending data to backend:', JSON.stringify(dataToSend, null, 2));
      
      const url = `${API_BASE_URL}/update/${formData.patientId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (data.success === true || response.status === 200) {
        setSubmitStatus('success');
        toast.success(`Patient ${formData.patientName} updated successfully!`);
        setTimeout(() => {
          setIsEditPatientOpen(false);
          fetchPatients();
        }, 1500);
      } else {
        setSubmitStatus('error');
        console.error('Backend returned error:', data);
        toast.error(`Update failed: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      setSubmitStatus('error');
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error: Unable to connect to server. Please check if the backend is running.');
      } else if (error.message.includes('HTTP error')) {
        toast.error(`Server error: ${error.message}. Please check the backend logs.`);
      } else {
        toast.error(`Error saving patient information: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    const patient = allPatients.find(p => p.id === patientId);
    const patientName = patient ? patient.name : patientId;

    const confirmDelete = window.confirm(`Are you sure you want to delete patient "${patientName}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        const response = await fetch(`${API_BASE_URL}/delete/${patientId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
          toast.success(`Patient ${patientName} deleted successfully`);
          await fetchPatients();
        } else {
          toast.error(`Delete failed: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error(`Error deleting patient ${patientName}. Please try again.`);
      } finally {
        setIsDeleting(false);
      }
    } else {
      toast.info('Delete operation cancelled');
    }
  };

  const handleGeneratePDF = (patient) => {
    try {
      // The PDF generation is now handled in the ViewPatientModal component
      // This callback is just for showing success/error messages
      toast.success('PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please check if popups are allowed.');
    }
  };

  // Get today's date in YYYY-MM-DD format for comparison
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loading && patients.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-g4 ray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPatients}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const todayDate = getTodayDate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600">Manage patient records and information</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-blue-700 transition-colors duration-300">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600 group-hover:text-blue-800 transition-all duration-300 group-hover:scale-110">{allPatients.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-all duration-300 group-hover:rotate-12">
                <User className="h-6 w-6 text-blue-600 group-hover:text-blue-800" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-green-700 transition-colors duration-300">Registered Today</p>
                <p className="text-2xl font-bold text-green-600 group-hover:text-green-800 transition-all duration-300 group-hover:scale-110">
                  {allPatients.filter(p => p.registrationDate === todayDate).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-all duration-300 group-hover:rotate-12">
                <CheckCircle className="h-6 w-6 text-green-600 group-hover:text-green-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group/search">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-hover/search:text-blue-500 group-focus-within/search:text-blue-500 transition-all duration-300 group-focus-within/search:scale-110" />
              <input
                type="text"
                placeholder="Search by name, ID, phone, email, city, or blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-[1.02] hover:border-blue-300"
              />
              <div className="absolute inset-0 rounded-md bg-blue-500 opacity-0 group-focus-within/search:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  toast.info('Search cleared');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Showing {patients.length} of {allPatients.length} patients
            </div>
          )}
        </div>

        {/* Patient Records Table */}
        <div className="bg-white rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Patient Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm group/row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover/row:text-blue-600 transition-colors duration-200">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover/row:text-blue-600 transition-colors duration-200">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 transition-all duration-200 group-hover/row:scale-105">
                        {patient.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-all duration-200 hover:bg-blue-100 hover:scale-110 transform"
                          title="View Patient"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-all duration-200 hover:bg-green-100 hover:scale-110 transform"
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-all duration-200 hover:bg-red-100 hover:scale-110 transform"
                          title="Delete Patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center animate-pulse">
                        <User className="h-12 w-12 text-gray-300 mb-2" />
                        <p>
                          {searchTerm ? 
                            `No patients found matching "${searchTerm}"` : 
                            'No patients found'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Patient Modal */}
        <ViewPatientModal
          isOpen={isViewPatientOpen}
          onClose={() => {
            setIsViewPatientOpen(false);
            toast.info('Patient view closed');
          }}
          patient={selectedPatient}
          onEdit={handleEditPatient}
          onGeneratePDF={handleGeneratePDF}
        />

        {/* Edit Patient Modal */}
        <EditPatientModal
          isOpen={isEditPatientOpen}
          onClose={() => {
            setIsEditPatientOpen(false);
            setSubmitStatus(null);
            toast.info('Edit cancelled');
          }}
          patient={selectedPatient}
          onSave={handleSavePatient}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
        />

        {/* Loading Overlay for Delete Operation */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}

        {/* Loading Overlay for Form Submission */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;