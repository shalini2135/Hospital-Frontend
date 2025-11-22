const API_BASE_URL = 'https://appoitment-backend.onrender.com/api/appointments';

export const fetchAppointments = async (filters = {}) => {
  try {
    // Construct query parameters from filters
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map(transformAppointmentData);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchAppointmentById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return transformAppointmentData(data);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

// Helper function to safely parse dates
const parseDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  // Check if the date is valid
  return isNaN(date.getTime()) ? null : date;
};

// Transform backend data to frontend format
const transformAppointmentData = (appointment) => {
  const appointmentDateTime = parseDate(appointment.appointmentDateTime);
  const createdAt = parseDate(appointment.createdAt);
  const updatedAt = parseDate(appointment.updatedAt);

  // Format date and time safely
  const formattedDate = appointmentDateTime 
    ? appointmentDateTime.toISOString().split('T')[0]
    : 'No date set';
    
  const formattedTime = appointmentDateTime
    ? appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'No time set';

  return {
    id: appointment.id,
    patient: appointment.patientName || 'Unknown Patient',
    doctor: appointment.doctorName || `Dr. ${appointment.doctorId || 'Unknown'}`,
    date: formattedDate,
    time: formattedTime,
    status: appointment.status || 'PENDING',
    details: appointment.reason || appointment.symptoms || 'No details provided',
    contact: appointment.patientEmail || 'No email provided',
    phone: 'Not provided', // Phone not in backend data
    department: appointment.department || 'General',
    symptoms: appointment.symptoms || 'Not specified',
    additionalNotes: appointment.additionalNotes || 'None',
    duration: appointment.duration || 30, // Default 30 minutes
    emergency: appointment.emergency || false,
    rawDateTime: appointment.appointmentDateTime, // Keep original for potential operations
    createdAt: createdAt ? createdAt.toISOString() : null,
    updatedAt: updatedAt ? updatedAt.toISOString() : null,
     backendStatus: appointment.status || 'PENDING'
  };
};