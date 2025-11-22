import { useState, useEffect } from 'react';
import StatsCard from '../../components/Admin/StatsCard';
import DoctorCard from '../../components/Admin/DoctorCard';
import AppointmentCard from '../../components/Admin/AppointmentCard';
import DoctorProfileModal from '../../components/Admin/DoctorProfileModal';

const Dashboard = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [stats, setStats] = useState([
    { title: 'Total Patients', value: 'Loading...', change: '+12%', trend: 'up' },
    { title: 'Total Doctors', value: 'Loading...', change: '+5%', trend: 'up' },
    { title: 'Appointments', value: 'Loading...', change: '-8%', trend: 'down' },
    { title: 'Revenue', value: 'Loading...', change: '+18%', trend: 'up' },
  ]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // API endpoints
  const API_ENDPOINTS = {
    patients: 'https://patient-service-ntk0.onrender.com/api/patient/count',
    doctorCount: 'https://doctorpanel-backend.onrender.com/api/doctor/count',
    topDoctors: 'https://doctorpanel-backend.onrender.com/api/doctor/top-doctors-by-prescriptions',
    appointments: 'https://appoitment-backend.onrender.com/api/appointments/stats',
    revenue: 'https://billing-backend-0zk0.onrender.com/api/billing/total-amount'
  };

  const fetchWithRetry = async (url, options = {}, retries = 3) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First fetch the total doctor count separately
      let doctorCount = 0;
      try {
        const doctorCountRes = await fetchWithRetry(API_ENDPOINTS.doctorCount);
        doctorCount = doctorCountRes || 0;
      } catch (err) {
        console.error('Failed to fetch doctor count:', err);
        // If API fails, you can either:
        // 1. Set to known value (9 in your case)
        // doctorCount = 9;
        // OR
        // 2. Show error state
        throw new Error('Failed to load doctor count');
      }

      // Then fetch other data in parallel
      const [patientsRes, topDoctorsRes, revenueRes] = await Promise.all([
        fetchWithRetry(API_ENDPOINTS.patients).catch(() => ({ count: 'N/A' })),
        fetchWithRetry(API_ENDPOINTS.topDoctors).catch(() => []),
        fetchWithRetry(API_ENDPOINTS.revenue).catch(() => ({ data: 0 }))
      ]);

      // Update stats with all data
      setStats([
        { 
          title: 'Total Patients', 
          value: patientsRes.count?.toString() || 'N/A', 
          change: '+12%', 
          trend: 'up' 
        },
        { 
          title: 'Total Doctors', 
          value: doctorCount.toString(), // Use the separately fetched count
          change: '+5%', 
          trend: 'up' 
        },
        { 
          title: 'Appointments', 
          value: 'Loading...', // Will be updated separately
          change: '-8%', 
          trend: 'down' 
        },
        { 
          title: 'Revenue', 
          value: revenueRes.data ? `${revenueRes.data.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}` : '0.00', 
          change: '+18%', 
          trend: 'up' 
        },
      ]);

      // Format top doctors data (completely separate from total count)
      const formattedDoctors = (topDoctorsRes || []).map(doctor => ({
        doctorId: doctor.doctorId,
        nmrId: doctor.nmrId,
        name: doctor.doctorName,
        specialty: doctor.specialty,
        availability: doctor.status === 'Active' ? 'Available' : 'Unavailable',
        email: doctor.email,
        phone: doctor.phone,
        bio: doctor.bio,
        education: doctor.education,
        experience: doctor.experience,
        languages: doctor.languages?.split(', ') || [],
        status: doctor.status?.toLowerCase() || 'active',
        prescriptionCount: doctor.prescriptionCount || 0,
        photo: doctor.photoUr1
      }));
      setDoctors(formattedDoctors);

      // Try to fetch appointments data separately
      try {
        const appointmentsRes = await fetchWithRetry(API_ENDPOINTS.appointments);
        setStats(prev => {
          const newStats = [...prev];
          newStats[2] = { 
            ...newStats[2], 
            value: appointmentsRes.totalAppointments?.toString() || 'N/A' 
          };
          return newStats;
        });

        // Try to fetch recent appointments if endpoint exists
        try {
          const recentAppointmentsRes = await fetchWithRetry(API_ENDPOINTS.recentAppointments);
          setAppointments(recentAppointmentsRes.map(appt => ({
            id: appt.id,
            patient: appt.patientName || 'Unknown Patient',
            doctor: appt.doctorName || 'Unknown Doctor',
            time: appt.appointmentTime || 'N/A',
            status: appt.status || 'Pending'
          })));
        } catch {
          // Fallback to mock appointments if API fails
          setAppointments([
            { id: 1, patient: 'John Doe', doctor: formattedDoctors[0]?.name || 'Dr. Smith', time: '10:00 AM', status: 'Confirmed' },
            { id: 2, patient: 'Jane Smith', doctor: formattedDoctors[1]?.name || 'Dr. Johnson', time: '2:30 PM', status: 'Pending' }
          ]);
        }
      } catch (apptError) {
        console.warn('Failed to fetch appointments:', apptError);
        setStats(prev => {
          const newStats = [...prev];
          newStats[2] = { 
            ...newStats[2], 
            value: 'N/A' 
          };
          return newStats;
        });
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      // Auto-retry after 5 seconds
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [retryCount]);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsProfileModalOpen(true);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Error and Loading States */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>Error loading data: {error}</span>
          <button 
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}
      
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-blue-500">Loading dashboard data...</span>
        </div>
      )}
      
      {/* Main Content */}
      {!isLoading && (
        <>
          {/* Doctors and Appointments */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Top Doctors */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Top Doctors</h2>
                <span className="text-sm text-gray-500">Showing {doctors.length} of {doctors.length}</span>
              </div>
              <div className="space-y-4">
                {doctors.length > 0 ? (
                  doctors.slice(0, 5).map((doctor) => (
                    <DoctorCard 
                      key={doctor.doctorId} 
                      {...doctor} 
                      onViewProfile={() => handleViewProfile(doctor)}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No doctor data available
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
                <span className="text-sm text-gray-500">{appointments.length} appointments</span>
              </div>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} {...appointment} />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No recent appointments
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default Dashboard;