import { useState, useEffect } from 'react';
import { 
  HiMail, 
  HiPhone, 
  HiStatusOnline,
  HiUserCircle,
  HiAcademicCap,
  HiBriefcase,
  HiGlobe,
  HiSearch,
  HiTrash,
  HiPencil,
  HiEye,
  HiPhotograph,
  HiExclamationCircle
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import FormModal from '../../components/Admin/FormModal';
import DoctorProfileModal from '../../components/Admin/DoctorProfileModal';
import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById
} from './services/doctorService';
import LoadingSpinner from '../../components/Admin/LoadingSpinner';
import {registerUser} from '../Auth/api';

const Doctors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const data = await getAllDoctors();
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch doctors: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = async (newDoctor) => {
    try {
      console.log('Adding doctor:', newDoctor);
      
      // Remove confirmPassword from the payload
      const { confirmPassword, ...doctorData } = newDoctor;
      
      // Validate required fields
      if (!doctorData.doctorName || !doctorData.email || !doctorData.password || !doctorData.phone || !doctorData.specialty || !doctorData.nmrId) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate password match
      if (doctorData.password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const profilePhoto = newDoctor.profilePhoto instanceof File ? newDoctor.profilePhoto : null;
      
      const createdDoctor = await createDoctor(doctorData, profilePhoto);
      console.log(createdDoctor);
      const authResponse = await registerUser({
        username: createdDoctor.doctorName,
        email: createdDoctor.email,
        password: createdDoctor.password,
        userId: createdDoctor.doctorId
      });
      console.log('Auth response:', authResponse);

      // Refresh the doctors list
      await fetchDoctors();
      
      setIsModalOpen(false);
      toast.success('Doctor added successfully!');
    } catch (err) {
      console.error('Error details:', err);
      toast.error(`Failed to add doctor: ${err.message}`);
    }
  };

  const handleUpdateDoctor = async (updatedDoctor) => {
    try {
      console.log('Updating doctor:', updatedDoctor);
      
      const { id, confirmPassword, profilePhoto, ...doctorData } = updatedDoctor;
      
      // Use the doctorId from the selected doctor, not the id field
      const doctorId = selectedDoctor?.doctorId || id;
      
      if (!doctorId) {
        toast.error('Doctor ID not found');
        return;
      }

      // For updates, we keep the existing password if not changed
      const updateData = {
        ...doctorData,
        // Keep existing password if none provided
        password: doctorData.password || selectedDoctor.password
      };
      
      const updated = await updateDoctor(doctorId, updateData, null);
      
      // Refresh the doctors list
      await fetchDoctors();
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedDoctor(null);
      toast.success('Doctor updated successfully!');
    } catch (err) {
      console.error('Error details:', err);
      toast.error(`Failed to update doctor: ${err.message}`);
    }
  };

  const handleEditDoctor = (doctor) => {
    console.log('Editing doctor:', doctor);
    
    setSelectedDoctor({
      ...doctor,
      id: doctor.doctorId, // Use doctorId as id for form handling
      // Convert array to comma-separated string if needed
      languages: Array.isArray(doctor.languages) ? doctor.languages.join(', ') : doctor.languages || '',
      // Don't include password in edit form for security
      password: '',
      confirmPassword: '',
      status: doctor.status || 'Active',
      departmentId: doctor.departmentId || 'DEP-00001'
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleViewProfile = async (doctor) => {
    try {
      setProfileLoading(true);
      const profileData = await getDoctorById(doctor.doctorId);
      setSelectedDoctor({
        ...doctor,
        ...profileData
      });
      setIsProfileModalOpen(true);
    } catch (err) {
      toast.error(`Profile details couldn't load: ${err.message}`);
      setSelectedDoctor(doctor);
      setIsProfileModalOpen(true);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDeleteDoctor = (doctorId) => {
    const doctor = doctors.find(d => d.doctorId === doctorId);
    setDoctorToDelete(doctor);
    setDeleteModalOpen(true);
  };

  const confirmDeleteDoctor = async () => {
    try {
      await deleteDoctor(doctorToDelete.doctorId);
      
      // Refresh the doctors list
      await fetchDoctors();
      
      setDeleteModalOpen(false);
      setDoctorToDelete(null);
      toast.success('Doctor deleted successfully!');
    } catch (err) {
      toast.error(`Failed to delete doctor: ${err.message}`);
    }
  };

  const renderDoctorImage = (doctor) => {
    const handleImageError = (e) => {
      e.target.onerror = null;
      e.target.src = '/default-doctor.png';
    };

    if (doctor.photoUrl) {
      return (
        <img 
          src={doctor.photoUrl} 
          alt={doctor.doctorName}
          className="w-10 h-10 rounded-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      );
    }
    return <HiUserCircle className="w-10 h-10 text-gray-400" />;
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? 
      doctor.specialty?.toLowerCase() === selectedSpecialty.toLowerCase() : true;
    const matchesStatus = selectedStatus ? 
      doctor.status?.toLowerCase() === selectedStatus.toLowerCase() : true;
    
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 flex items-center">
          <HiExclamationCircle className="mr-2 text-xl" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header and Add Doctor Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Doctors Management</h1>
        <button
          onClick={() => {
            setIsEditMode(false);
            setSelectedDoctor(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Doctor
        </button>
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
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Hepatology">Hepatology</option>
              <option value="Psychology">Psychology</option>
              <option value="Dental">Dental</option>
              <option value="Eye Care">Eye Care</option>
              <option value="Fertility">Fertility</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No doctors found</div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor.doctorId} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center space-x-3">
                {renderDoctorImage(doctor)}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{doctor.doctorName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doctor.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>{doctor.specialty}</span>
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between">
                <button 
                  onClick={() => handleViewProfile(doctor)}
                  className="text-blue-600 text-sm font-medium"
                >
                  View
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditDoctor(doctor)}
                    className="text-gray-600 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteDoctor(doctor.doctorId)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div className="col-span-2">Photo</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Doctor ID</div>
          <div className="col-span-2">Specialty</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-1 text-left">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-8 text-gray-500 col-span-12">No doctors found</div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.doctorId}
              className="grid grid-cols-12 p-4 border-b border-gray-200 items-center hover:bg-gray-50 text-sm"
            >
              {/* Photo */}
              <div className="col-span-2">
                {renderDoctorImage(doctor)}
              </div>

              {/* Name */}
              <div className="col-span-2 font-medium truncate">{doctor.doctorName}</div>

              {/* Doctor ID */}
              <div className="col-span-2 text-gray-600 truncate">{doctor.doctorId}</div>

              {/* Specialty */}
              <div className="col-span-2 text-gray-600 truncate">{doctor.specialty}</div>

              {/* Email and Phone */}
              <div className="col-span-2">
                <div className="text-gray-600 truncate">{doctor.email}</div>
                <div className="text-sm text-gray-500 truncate">{doctor.phone}</div>
              </div>

              {/* Status */}
              <div className="col-span-1 text-left">
                <span
                  className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                    doctor.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doctor.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end space-x-2">
                <button
                  onClick={() => handleViewProfile(doctor)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="View Profile"
                >
                  <HiEye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEditDoctor(doctor)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doctor.doctorId)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedDoctor(null);
        }}
        onSubmit={isEditMode ? handleUpdateDoctor : handleAddDoctor}
        title={isEditMode ? "Edit Doctor" : "Add New Doctor"}
        fields={[
          { 
            name: 'profilePhoto', 
            label: 'Profile Photo', 
            type: 'file', 
            required: false,
            accept: 'image/*',
            icon: <HiPhotograph className="mr-2" />,
            currentValue: isEditMode ? selectedDoctor?.photoUrl : null
          },
          { name: 'doctorName', label: 'Full Name', type: 'text', required: true },
          { name: 'specialty', label: 'Specialty', type: 'select', 
            options: ['Cardiology', 'Neurology', 'Pediatrics', 'Hepatology', 'Psychology', 'Dental', 'Eye Care','Fertility'], 
            required: true 
          },
          {
            name: 'nmrId',
            label: 'NMR-ID',
            type: 'text',
            required: true,
          },
          { name: 'email', label: 'Email', type: 'email', required: true },
          ...(!isEditMode ? [
            {
              name: 'password',
              label: 'Password',
              type: 'password',
              required: true,
              pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
              title: "Password must be at least 8 characters with at least 1 letter and 1 number",
              placeholder: "Enter password (min 8 characters)"
            },
            {
              name: 'confirmPassword',
              label: 'Confirm Password',
              type: 'password',
              required: true,
              validate: (value, formData) => value === formData.password,
              errorMessage: "Passwords must match",
              placeholder: "Re-enter your password"
            }
          ] : []),
          { name: 'phone', label: 'Phone', type: 'tel', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea', required: false },
          { name: 'education', label: 'Education', type: 'text', required: false },
          { name: 'experience', label: 'Experience', type: 'text', required: false },
          { name: 'languages', label: 'Languages (comma separated)', type: 'text', required: false },
          { 
            name: 'status', 
            label: 'Status', 
            type: 'select',
            options: ['Active', 'On Leave'],
            required: true,
            defaultValue: 'Active'
          },
          {
            name: 'departmentId',
            label: 'Department ID',
            type: 'text',
            required: true,
            defaultValue: 'DEP-00001'
          },
        ]}
        initialData={isEditMode ? selectedDoctor : {}}
      />

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <DoctorProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          doctor={selectedDoctor}
          isLoading={profileLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteDoctor}
        itemType="doctor"
        itemName={doctorToDelete?.doctorName || ''}
      />
    </div>
  );
};

export default Doctors;