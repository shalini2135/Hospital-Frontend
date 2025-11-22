import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Plus, 
  ChevronDown,
  Users,
  User,
  X,
  UserPlus,
  Heart,
  AlertCircle,
  Loader2,
  RefreshCw,
  Edit,
  Trash2,
  Check,
  Ban,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// API Configuration
const API_CONFIG = {
  appointments: 'https://appoitment-backend.onrender.com/api/appointments',
  patients: 'https://patient-service-ntk0.onrender.com/api/patient'
};

// API Service Layer
class ApiService {
  static async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  static async getAppointments() {
    return this.request(API_CONFIG.appointments);
  }

  static async createAppointment(appointmentData) {
    return this.request(`${API_CONFIG.appointments}/create`, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  static async updateAppointment(appointmentId, appointmentData) {
    return this.request(`${API_CONFIG.appointments}/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  static async confirmAppointment(appointmentId) {
    return this.request(`${API_CONFIG.appointments}/${appointmentId}/confirm`, {
      method: 'PUT',
    });
  }

  static async cancelAppointment(appointmentId, reason) {
    return this.request(`${API_CONFIG.appointments}/cancel/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  static async completeAppointment(appointmentId) {
    return this.request(`${API_CONFIG.appointments}/${appointmentId}/complete`, {
      method: 'PUT',
    });
  }

  static async deleteAppointment(appointmentId) {
    return this.request(`${API_CONFIG.appointments}/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  static async getPatientById(patientId) {
    return this.request(`${API_CONFIG.patients}/${patientId}`);
  }
}

// Custom Hooks
const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      const newAppointment = await ApiService.createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointment = useCallback(async (appointmentId, appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAppointment = await ApiService.updateAppointment(appointmentId, appointmentData);
      setAppointments(prev => prev.map(apt => 
        apt.appointmentId === appointmentId ? updatedAppointment : apt
      ));
      return updatedAppointment;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmAppointment = useCallback(async (appointmentId) => {
    try {
      await ApiService.confirmAppointment(appointmentId);
      setAppointments(prev => prev.map(apt => 
        apt.appointmentId === appointmentId ? { ...apt, status: 'CONFIRMED' } : apt
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId, reason) => {
    try {
      await ApiService.cancelAppointment(appointmentId, reason);
      setAppointments(prev => prev.map(apt => 
        apt.appointmentId === appointmentId ? { ...apt, status: 'CANCELLED' } : apt
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const completeAppointment = useCallback(async (appointmentId) => {
    try {
      await ApiService.completeAppointment(appointmentId);
      setAppointments(prev => prev.map(apt => 
        apt.appointmentId === appointmentId ? { ...apt, status: 'COMPLETED' } : apt
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  const deleteAppointment = useCallback(async (appointmentId) => {
    try {
      await ApiService.deleteAppointment(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.appointmentId !== appointmentId));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
    clearError: () => setError(null)
  };
};

// Notification Component
const NotificationToast = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} px-4 py-3 rounded shadow-lg max-w-md border`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Status Cards Component
const StatusCards = ({ appointments }) => {
  const statusData = useMemo(() => [
    {
      title: "Today's Appointments",
      count: appointments.filter(apt => 
        apt.appointmentDateTime && 
        new Date(apt.appointmentDateTime).toDateString() === new Date().toDateString()
      ).length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Confirmed",
      count: appointments.filter(apt => apt.status === 'CONFIRMED').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Pending",
      count: appointments.filter(apt => apt.status === 'PENDING').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: "Cancelled",
      count: appointments.filter(apt => apt.status === 'CANCELLED').length,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ], [appointments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statusData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                <p className="text-3xl font-bold text-gray-900">{item.count}</p>
              </div>
              <div className={`${item.bgColor} p-3 rounded-lg`}>
                <IconComponent className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Search Filters Component
const SearchFilters = ({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, selectedDate, setSelectedDate, onNewAppointment, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients, doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option>All Status</option>
              <option>CONFIRMED</option>
              <option>PENDING</option>
              <option>CANCELLED</option>
              <option>COMPLETED</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={onNewAppointment}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-lg transform hover:scale-105"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          New Appointment
        </button>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>Showing</span>
        <span className="font-medium">{startItem}</span>
        <span>to</span>
        <span className="font-medium">{endItem}</span>
        <span>of</span>
        <span className="font-medium">{totalItems}</span>
        <span>appointments</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onConfirm, onCancel, onComplete, onDelete, onEdit, onView }) => {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(appointment.appointmentDateTime);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {appointment.patientName || 'Unknown Patient'}
          </h4>
          <p className="text-gray-600 mb-1">{appointment.doctorName}</p>
          <p className="text-sm text-gray-500 mb-1">{appointment.departmentName}</p>
          <p className="text-sm text-gray-500">{appointment.phone || 'N/A'}</p>
          <p className="text-sm text-gray-400 mt-2">Reason: {appointment.reason || 'N/A'}</p>
          {appointment.symptoms && (
            <p className="text-sm text-gray-400">Symptoms: {appointment.symptoms}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-900">{time}</p>
          <p className="text-sm text-gray-500 mb-2">{date}</p>
          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
          
          {/* Inline Action Buttons */}
          <div className="flex gap-1 mt-3">
            <button
              onClick={() => onView(appointment)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onEdit(appointment)}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Edit Appointment"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            {appointment.status === 'PENDING' && (
              <button
                onClick={() => onConfirm(appointment.appointmentId)}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Confirm Appointment"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            
            {appointment.status === 'CONFIRMED' && (
              <button
                onClick={() => onComplete(appointment.appointmentId)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Mark as Completed"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            
            {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
              <button
                onClick={() => onCancel(appointment.appointmentId)}
                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Cancel Appointment"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => onDelete(appointment.appointmentId)}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Delete Appointment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Appointment Component
const Appointment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [fetchingPatient, setFetchingPatient] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
    clearError
  } = useAppointments();

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorName: '',
    departmentName: '',
    date: '',
    time: '',
    phone: '',
    patientEmail: '',
    age: '',
    symptoms: '',
    reason: ''
  });

  const doctors = [
    { name: 'Dr. Sarah Johnson', department: 'Cardiology' },
    { name: 'Dr. Michael Brown', department: 'Neurology' },
    { name: 'Dr. Emily Davis', department: 'Orthopedics' },
    { name: 'Dr. James Wilson', department: 'Pediatrics' },
    { name: 'Dr. Lisa Chen', department: 'Dermatology' },
    { name: 'Dr. Robert Taylor', department: 'Internal Medicine' }
  ];

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedDate]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  // Fetch patient data when patient ID changes
  const fetchPatientData = async (patientId) => {
    if (!patientId.trim()) {
      setPatientData(null);
      return;
    }

    try {
      setFetchingPatient(true);
      const patient = await ApiService.getPatientById(patientId);
      setPatientData(patient);
      
      // Auto-fill form with patient data
      setFormData(prev => ({
        ...prev,
        patientName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || patient.name || '',
        phone: patient.phoneNumber || patient.phone || '',
        patientEmail: patient.email || '',
        age: patient.age || ''
      }));
      
      setNotification({ message: 'Patient data loaded successfully!', type: 'success' });
    } catch (error) {
      setPatientData(null);
      setNotification({ message: `Patient not found: ${error.message}`, type: 'error' });
    } finally {
      setFetchingPatient(false);
    }
  };

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = (appointment.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (appointment.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All Status' || appointment.status === selectedStatus;
      const matchesDate = !selectedDate || 
                         (appointment.appointmentDateTime && 
                          new Date(appointment.appointmentDateTime).toDateString() === new Date(selectedDate).toDateString());
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, selectedStatus, selectedDate]);

  // Paginated appointments
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Fetch patient data when patient ID is entered
    if (field === 'patientId') {
      if (value.length >= 3) { // Fetch after 3 characters
        fetchPatientData(value);
      } else {
        setPatientData(null);
      }
    }
    
    // Auto-fill department when doctor is selected
    if (field === 'doctorName') {
      const selectedDoctor = doctors.find(doc => doc.name === value);
      if (selectedDoctor) {
        setFormData(prev => ({ ...prev, departmentName: selectedDoctor.department }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      doctorName: '',
      departmentName: '',
      date: '',
      time: '',
      phone: '',
      patientEmail: '',
      age: '',
      symptoms: '',
      reason: ''
    });
    setPatientData(null);
    setEditingAppointment(null);
  };

  const handleSubmit = async () => {
    try {
      const appointmentData = {
        ...formData,
        appointmentDateTime: `${formData.date}T${formData.time}:00`,
        age: parseInt(formData.age) || 0,
        status: 'PENDING'
      };

      if (editingAppointment) {
        await updateAppointment(editingAppointment.appointmentId, appointmentData);
        setNotification({ message: 'Appointment updated successfully!', type: 'success' });
      } else {
        await createAppointment(appointmentData);
        setNotification({ message: 'Appointment created successfully!', type: 'success' });
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    }
  };

  const handleEdit = (appointment) => {
    const appointmentDate = appointment.appointmentDateTime ? new Date(appointment.appointmentDateTime) : null;
    
    setFormData({
      patientId: appointment.patientId || '',
      patientName: appointment.patientName || '',
      doctorName: appointment.doctorName || '',
      departmentName: appointment.departmentName || '',
      date: appointmentDate ? appointmentDate.toISOString().split('T')[0] : '',
      time: appointmentDate ? appointmentDate.toTimeString().slice(0, 5) : '',
      phone: appointment.phone || '',
      patientEmail: appointment.patientEmail || '',
      age: appointment.age || '',
      symptoms: appointment.symptoms || '',
      reason: appointment.reason || ''
    });
    
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleView = (appointment) => {
    setViewingAppointment(appointment);
    setShowViewModal(true);
  };

  const handleAction = async (action, appointmentId) => {
    try {
      switch (action) {
        case 'confirm':
          await confirmAppointment(appointmentId);
          setNotification({ message: 'Appointment confirmed!', type: 'success' });
          break;
        case 'complete':
          await completeAppointment(appointmentId);
          setNotification({ message: 'Appointment completed!', type: 'success' });
          break;
        case 'cancel':
          const reason = prompt('Please provide a reason for cancellation:');
          if (reason) {
            await cancelAppointment(appointmentId, reason);
            setNotification({ message: 'Appointment cancelled!', type: 'success' });
          }
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this appointment?')) {
            await deleteAppointment(appointmentId);
            setNotification({ message: 'Appointment deleted!', type: 'success' });
          }
          break;
      }
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })} 
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage patient appointments and scheduling</p>
        </div>

        {/* Status Cards */}
        <StatusCards appointments={appointments} />

        {/* Search and Actions */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onNewAppointment={() => { resetForm(); setShowModal(true); }}
          loading={loading}
        />

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Appointments ({filteredAppointments.length})</h3>
            </div>
          </div>
          
          <div className="p-6">
            {loading && appointments.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-500">Create your first appointment to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.appointmentId}
                    appointment={appointment}
                    onConfirm={(id) => handleAction('confirm', id)}
                    onCancel={(id) => handleAction('cancel', id)}
                    onComplete={(id) => handleAction('complete', id)}
                    onDelete={(id) => handleAction('delete', id)}
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredAppointments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAppointments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Patient ID"
                      value={formData.patientId}
                      onChange={(e) => handleInputChange('patientId', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {fetchingPatient && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-600" />
                    )}
                  </div>
                  {patientData && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      ✓ Patient found: {patientData.firstName} {patientData.lastName}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Patient Name *"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.patientEmail}
                  onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Age *"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Doctor *</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor.name}>
                      {doctor.name} - {doctor.department}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.departmentName}
                  readOnly
                  className="p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4 space-y-4">
                <textarea
                  placeholder="Symptoms *"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="2"
                />
                <textarea
                  placeholder="Reason for Visit *"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingAppointment ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowViewModal(false)}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Appointment Details</h2>
                <button onClick={() => setShowViewModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div><strong>Patient ID:</strong> {viewingAppointment.patientId}</div>
                <div><strong>Patient:</strong> {viewingAppointment.patientName}</div>
                <div><strong>Doctor:</strong> {viewingAppointment.doctorName}</div>
                <div><strong>Department:</strong> {viewingAppointment.departmentName}</div>
                <div><strong>Date & Time:</strong> {new Date(viewingAppointment.appointmentDateTime).toLocaleString()}</div>
                <div><strong>Phone:</strong> {viewingAppointment.phone}</div>
                <div><strong>Email:</strong> {viewingAppointment.patientEmail}</div>
                <div><strong>Age:</strong> {viewingAppointment.age}</div>
                <div><strong>Status:</strong> {viewingAppointment.status}</div>
                <div><strong>Reason:</strong> {viewingAppointment.reason}</div>
                <div><strong>Symptoms:</strong> {viewingAppointment.symptoms}</div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;