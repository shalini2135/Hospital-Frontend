// const API_URL = 'https://appoitment-backend.onrender.com/api/appointments';

// export default {
//   async getAllAppointments() {
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) throw new Error('Failed to fetch appointments');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       throw error;
//     }
//   },

//   async createAppointment(appointmentData) {
//     try {
//        console.log(appointmentData);
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(appointmentData),
//       });
//       if (!response.ok) throw new Error('Failed to create appointment');
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating appointment:', error);
//       throw error;
//     }
//   },

//   async getAppointmentById(id) {
//     try {
//       const response = await fetch(`${API_URL}/${id}`);
//       if (!response.ok) throw new Error('Failed to fetch appointment');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching appointment:', error);
//       throw error;
//     }
//   },

//   async updateAppointment(id, appointmentData) {
//     try {
//       console.log('Sending update for:', id, 'with data:', appointmentData);
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(appointmentData),
//       });
//       if (!response.ok) throw new Error('Failed to update appointment');
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating appointment:', error);
//       throw error;
//     }
//   },

//   // In appointService.js
// async cancelAppointment(id) {
//   try {
//     console.log('Cancelling appointment with ID:', id);
    
//     const response = await fetch(`${API_URL}/cancel/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json' // optional, depending on your backend
//       }
//     });

//     if (!response.ok) {
//       throw new Error('Failed to cancel appointment');
//     }

//     return id;
//   } catch (error) {
//     console.error('Error canceling appointment:', error);
//     throw error;
//   }
// }
// ,

//   async rescheduleAppointment(id, newDateTime) {
//     try {
//       const response = await fetch(`${API_URL}/${id}/reschedule?newDateTime=${newDateTime.toISOString()}`, {
//         method: 'POST',
//       });
//       if (!response.ok) throw new Error('Failed to reschedule appointment');
//       return await response.json();
//     } catch (error) {
//       console.error('Error rescheduling appointment:', error);
//       throw error;
//     }
//   },

//   async getUpcomingAppointmentsByPatient(patientId) {
//     try {
//       const response = await fetch(`${API_URL}/patient/${patientId}/upcoming`);
//       if (!response.ok) throw new Error('Failed to fetch patient appointments');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching patient appointments:', error);
//       throw error;
//     }
//   },

//   async getUpcomingAppointmentsByDoctor(doctorId) {
//     try {
//       const response = await fetch(`${API_URL}/doctor/${doctorId}/upcoming`);
//       if (!response.ok) throw new Error('Failed to fetch doctor appointments');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching doctor appointments:', error);
//       throw error;
//     }
//   },

//   async getAppointmentHistoryByDoctor(doctorId) {
//     try {
//       const response = await fetch(`${API_URL}/doctor/${doctorId}/history`);
//       if (!response.ok) throw new Error('Failed to fetch doctor history');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching doctor history:', error);
//       throw error;
//     }
//   },

//   async getAppointmentStats() {
//     try {
//       const response = await fetch(`${API_URL}/stats`);
//       if (!response.ok) throw new Error('Failed to fetch stats');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       throw error;
//     }
//   },

//   async confirmAppointment(appointmentId) {
//     try {
//       const response = await fetch(`${API_URL}/${appointmentId}/confirm`, {
//         method: 'PUT',
//       });
//       if (!response.ok) throw new Error('Failed to confirm appointment');
//       return await response.text(); // Returns the success message
//     } catch (error) {
//       console.error('Error confirming appointment:', error);
//       throw error;
//     }
//   }
// };




const API_URL = "https://appointment-backend.onrender.com/api/appointments";
const PATIENT_API_URL = "https://patient-service-ntk0.onrender.com/api/patient/get";

export default {
  // -------------------- PATIENT FUNCTIONS --------------------
  async getAllPatients() {
    try {
      const response = await fetch(PATIENT_API_URL);
      if (!response.ok) throw new Error("Failed to fetch patients");
      return await response.json();
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },

  async getPatientById(patientId) {
    try {
      const response = await fetch(`${PATIENT_API_URL}/${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch patient details");
      return await response.json();
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  },

  // -------------------- APPOINTMENT FUNCTIONS --------------------
  async getAllAppointments(withPatient = false) {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const appointments = await response.json();

      if (withPatient) {
        // Attach patient details to each appointment
        const enriched = await Promise.all(
          appointments.map(async (appt) => {
            const patient = await this.getPatientById(appt.patientId);
            return { ...appt, patient };
          })
        );
        return enriched;
      }

      return appointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },

  async createAppointment(appointmentData) {
    try {
      console.log("Creating appointment:", appointmentData);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to create appointment");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  async getAppointmentById(id, withPatient = false) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch appointment");
      const appointment = await response.json();

      if (withPatient) {
        const patient = await this.getPatientById(appointment.patientId);
        return { ...appointment, patient };
      }

      return appointment;
    } catch (error) {
      console.error("Error fetching appointment:", error);
      throw error;
    }
  },

  async updateAppointment(id, appointmentData) {
    try {
      console.log("Updating appointment:", id, appointmentData);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) throw new Error("Failed to update appointment");
      return await response.json();
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  },

  async cancelAppointment(id) {
    try {
      console.log("Cancelling appointment with ID:", id);
      const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to cancel appointment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      throw error;
    }
  },

  async rescheduleAppointment(id, newDateTime) {
    try {
      const response = await fetch(`${API_URL}/${id}/reschedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newDateTime }),
      });
      if (!response.ok) throw new Error("Failed to reschedule appointment");
      return await response.json();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      throw error;
    }
  },

  async getUpcomingAppointmentsByPatient(patientId, withPatient = false) {
    try {
      const response = await fetch(`${API_URL}/patient/${patientId}/upcoming`);
      if (!response.ok) throw new Error("Failed to fetch patient appointments");
      const appointments = await response.json();

      if (withPatient) {
        const patient = await this.getPatientById(patientId);
        return appointments.map((appt) => ({ ...appt, patient }));
      }

      return appointments;
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
      throw error;
    }
  },

  async getUpcomingAppointmentsByDoctor(doctorId) {
    try {
      const response = await fetch(`${API_URL}/doctor/${doctorId}/upcoming`);
      if (!response.ok) throw new Error("Failed to fetch doctor appointments");
      return await response.json();
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
      throw error;
    }
  },

  async getAppointmentHistoryByDoctor(doctorId) {
    try {
      const response = await fetch(`${API_URL}/doctor/${doctorId}/history`);
      if (!response.ok) throw new Error("Failed to fetch doctor history");
      return await response.json();
    } catch (error) {
      console.error("Error fetching doctor history:", error);
      throw error;
    }
  },

  async getAppointmentStats() {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      return await response.json();
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },

  async confirmAppointment(appointmentId) {
    try {
      const response = await fetch(`${API_URL}/${appointmentId}/confirm`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to confirm appointment");
      return await response.json();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      throw error;
    }
  },
};
