// src/services/patientService.js
import axios from 'axios';

const API_URL = 'https://patient-service-ntk0.onrender.com/api/patient';

export const getAllPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    return response.data.data; // Returns the array of patients
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${patientId}`);
    return response.data.success;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};