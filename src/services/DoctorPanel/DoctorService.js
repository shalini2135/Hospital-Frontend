import axios from 'axios';

const REST_API_BASE_URL = 'https://doctorpanel-backend.onrender.com/api/doctor';

// Get doctor by ID (used for doctor profile and authentication)
export const getDoctorById = (doctorId) =>
  axios.get(`${REST_API_BASE_URL}/${doctorId}`);

// Get all doctors (used for doctor listings)
export const getAllDoctors = () =>
  axios.get(`${REST_API_BASE_URL}`);

// Get doctors by specialty (used for filtering doctors)
export const getDoctorsBySpecialty = (specialty) =>
  axios.get(`${REST_API_BASE_URL}/by-specialty`, {
    params: { specialty },
  });

// Get doctor count (used for dashboard statistics)
export const getDoctorCount = async () => {
  const response = await axios.get(`${REST_API_BASE_URL}/count`);
  return response.data;
};