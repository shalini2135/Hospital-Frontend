import axios from 'axios';

const REST_API_BASE_URL = 'https://appoitment-backend.onrender.com/api/appointments';

// Get upcoming appointments by doctor ID (used in Medical Appointments)
export const listUpcomingAppointmentsByDoctorId = (id) =>
  axios.get(`${REST_API_BASE_URL}/doctor/${id}/upcoming`);

// Get completed appointments by doctor ID (used in Medical Appointments)
export const listCompletedAppointmentsByDoctorId = (id) =>
  axios.get(`${REST_API_BASE_URL}/doctor/${id}/completed`);

// Get completed appointments by patient ID (used for patient history)
export const listCompletedAppointmentsByPatientId = (patientId) =>
  axios.get(`${REST_API_BASE_URL}/patient/${patientId}/completed`);

// Create new appointment (used for scheduling)
export const createAppointment = (appointmentData) =>
  axios.post(`${REST_API_BASE_URL}/create`, appointmentData);

// Update appointment status (used for general status updates)
export const updateAppointmentStatus = (id, status) =>
  axios.put(`${REST_API_BASE_URL}/${id}`, { status });

// Mark appointment as completed (used in PrescriptionForm)
export const markAppointmentCompleted = async (appointmentId) => {
  try {
    console.log(`Marking appointment ${appointmentId} as completed`);
    const response = await axios.put(`${REST_API_BASE_URL}/${appointmentId}/complete`);
    console.log('Appointment marked as completed:', response.data);
    return response;
  } catch (error) {
    console.error('Error marking appointment as completed:', error);
    if (error.response?.status === 404) {
      console.error(`Appointment with ID ${appointmentId} not found`);
    }
    throw error;
  }
};

// Cancel appointment (used for appointment cancellation)
export const cancelAppointmentById = async (appointmentId, reason) => {
  try {
    console.log(`Cancelling appointment ${appointmentId} with reason: ${reason}`);
    
    const response = await axios.put(
      `${REST_API_BASE_URL}/cancel/${appointmentId}`,
      { reason }
    );
    
    console.log('Appointment cancelled successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// Create revisit appointment (used for follow-up appointments)
export const createRevisitAppointment = (appointmentId, revisitData) =>
  axios.post(`${REST_API_BASE_URL}/revisit/${appointmentId}`, revisitData);

// Confirm appointment (used for appointment confirmation)
export const confirmAppointment = (id) =>
  axios.put(`${REST_API_BASE_URL}/${id}/confirm`);