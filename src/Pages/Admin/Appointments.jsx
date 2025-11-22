import { useState, useEffect } from 'react';
import AppointmentCard from '../../components/Admin/AppointmentCard';
import { fetchAppointments } from './services/appointmentService';
import LoadingSpinner from '../../components/Admin/LoadingSpinner';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        const filters = {};
        if (selectedStatus) filters.status = selectedStatus;
        const data = await fetchAppointments(filters);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [selectedStatus]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = appointments
    .filter(appointment => {
      const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = selectedDate ? appointment.date === selectedDate : true;
      const matchesStatus = selectedStatus ? appointment.backendStatus === selectedStatus.toUpperCase() : true;
      
      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'patient-asc': return a.patient.localeCompare(b.patient);
        case 'patient-desc': return b.patient.localeCompare(a.patient);
        case 'doctor-asc': return a.doctor.localeCompare(b.doctor);
        case 'doctor-desc': return b.doctor.localeCompare(a.doctor);
        default: return 0;
      }
    });

  const uniqueDates = [...new Set(appointments.map(app => app.date))].sort();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-sm text-gray-600">View and manage patient appointments</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 md:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
            <select
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="patient-asc">Patient (A-Z)</option>
              <option value="patient-desc">Patient (Z-A)</option>
              <option value="doctor-asc">Doctor (A-Z)</option>
              <option value="doctor-desc">Doctor (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Count */}
      <div className="mb-3 text-sm text-gray-600">
        Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              {...appointment} 
              onViewDetails={() => handleViewDetails(appointment)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-500">No appointments found matching your criteria</p>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedAppointment.patient}</h3>
                  <p className="text-sm text-gray-600">Patient</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedAppointment.doctor}</h3>
                  <p className="text-sm text-gray-600">Doctor</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-gray-600">Date</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedAppointment.time}</h3>
                    <p className="text-sm text-gray-600">Time</p>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedAppointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    selectedAppointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedAppointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedAppointment.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Status</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedAppointment.details}</h3>
                  <p className="text-sm text-gray-600">Appointment Details</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedAppointment.phone}</h3>
                    <p className="text-sm text-gray-600">Phone</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedAppointment.contact}</h3>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded hover:bg-blue-700 transition-colors"
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

export default Appointments;