// src/components/Admin/Patients.js
import { useState, useEffect } from 'react';
import { 
  HiUserCircle, 
  HiPhone, 
  HiMail,
  HiHome,
  HiClipboardList,
  HiShieldExclamation,
  HiUser,
  HiCalendar,
  HiHeart,
  HiSearch,
  HiTrash,
  HiPencil,
  HiEye
} from 'react-icons/hi';
import PatientProfileModal from '../../components/Admin/PatientProfileModal';
import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';
import { getAllPatients, deletePatient } from './services/patientService';

const Patients = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        setPatients(patientsData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleViewProfile = (patient) => {
    setSelectedPatient(formatPatientForDisplay(patient));
    setIsProfileModalOpen(true);
  };

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setDeleteModalOpen(true);
  };

  const confirmDeletePatient = async () => {
    try {
      await deletePatient(patientToDelete.patientId);
      setPatients(patients.filter(p => p.patientId !== patientToDelete.patientId));
      setDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  const formatPatientForDisplay = (patient) => {
    return {
      id: patient.patientId,
      name: patient.patientName,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodGroup,
      email: patient.patientEmail,
      phone: patient.contactNumber,
      address: `${patient.address || ''}, ${patient.city || ''}, ${patient.state || ''} ${patient.zipCode || ''}`.trim(),
      emergencyContacts: patient.emergencyContacts || [],
      medicalHistory: 'Not specified',
      allergies: 'Not specified',
      assignedDoctor: 'Not assigned',
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      city: patient.city,
      state: patient.state
    };
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesGender = selectedGender ? patient.gender?.toLowerCase() === selectedGender.toLowerCase() : true;
    const matchesBloodType = selectedBloodType ? patient.bloodGroup?.toLowerCase() === selectedBloodType.toLowerCase() : true;
    
    return matchesSearch && matchesGender && matchesBloodType;
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-red-50 text-red-600 rounded-lg">
        <p>Error loading patients: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Patients Management</h1>
        <div className="text-sm text-gray-500">
          Total Patients: {patients.length} | Showing: {filteredPatients.length}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient.patientId} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center space-x-3">
                <HiUserCircle className="w-10 h-10 text-gray-400" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{patient.patientName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 
                      patient.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {patient.gender}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>Age: {patient.age}</span>
                    <span>Blood: {patient.bloodGroup}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between">
                <button 
                  onClick={() => handleViewProfile(patient)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleDeletePatient(patient)}
                  className="text-red-600 text-sm font-medium hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center text-gray-500">
            No patients found matching your criteria
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Age</div>
          <div className="col-span-2">Gender</div>
          <div className="col-span-2">Blood Type</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient.patientId} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-4 font-medium">{patient.patientName}</div>
              <div className="col-span-2 text-gray-600">{patient.age}</div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                  patient.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {patient.gender}
                </span>
              </div>
              <div className="col-span-2 text-gray-600">{patient.bloodGroup}</div>
              <div className="col-span-2 flex justify-end space-x-2">
                <button 
                  onClick={() => handleViewProfile(patient)}
                  className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                  title="View Profile"
                >
                  <HiEye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeletePatient(patient)}
                  className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No patients found matching your search and filter criteria
          </div>
        )}
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <PatientProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          patient={selectedPatient}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeletePatient}
        itemType="patient"
        itemName={patientToDelete?.patientName || ''}
      />
    </div>
  );
};

export default Patients;