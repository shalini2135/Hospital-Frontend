import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    specialty: "",
    doctor: "",
    doctorId: "",
    date: "",
    time: "",
    emergency: false,
    reason: "",
    notes: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = "https://appoitment-backend.onrender.com";
  const APPOINTMENT_API_URL = `${API_BASE_URL}/api/appointments/create`;
  const PATIENT_API_URL =
    "https://patient-service-ntk0.onrender.com/api/patient";

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const createAppointmentDateTime = (date, time) => {
    if (!date || !time) return null;

    const dateTimeString = `${date}T${time}`;
    const localDateTime = new Date(dateTimeString);
    const utcDateTime = new Date(
      localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000
    );

    const isoString = utcDateTime.toISOString();
    const hoursUTC = utcDateTime.getUTCHours();

    if (hoursUTC < 9 || hoursUTC >= 17) {
      throw new Error("Appointments must be between 9AM and 5PM UTC");
    }

    return isoString;
  };

  // Enhanced retry function with better 409 handling
  const makeRequestWithRetry = async (data, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
        console.log(`📤 Sending POST to: ${APPOINTMENT_API_URL}`);
        console.log(`📦 Request data:`, JSON.stringify(data, null, 2));

        const response = await axios.post(APPOINTMENT_API_URL, data, {
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log(`✅ Success! Response:`, response.data);
        return response;
      } catch (error) {
        console.log(`❌ Attempt ${attempt} failed:`, error.message);

        if (error.response) {
          console.log(`📋 Error details:`, {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
          });

          // Handle 409 Conflict specifically - DON'T RETRY
          if (error.response.status === 409) {
            const conflictMessage =
              error.response.data?.message ||
              "The selected time slot is not available";
            console.log(
              "🚫 409 Conflict - Not retrying for scheduling conflicts"
            );
            throw new Error(conflictMessage);
          }
        }

        // Only retry for network errors or server errors (5xx), not for 4xx client errors
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          console.log("❌ Client error - not retrying");
          throw error;
        }

        if (attempt === maxRetries) {
          throw error;
        }

        const waitTime = attempt * 2000;
        console.log(`⏳ Retrying in ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  };

  useEffect(() => {
    if (doctor) {
      localStorage.setItem("selectedDoctor", JSON.stringify(doctor));
      setForm((prev) => ({
        ...prev,
        doctor: doctor.name || doctor.doctorName || "",
        specialty: doctor.specialty || "",
        doctorId: doctor.doctorId || "",
      }));
    } else {
      const storedDoctor = JSON.parse(localStorage.getItem("selectedDoctor"));
      if (storedDoctor) {
        setForm((prev) => ({
          ...prev,
          doctor: storedDoctor.name || storedDoctor.doctorName || "",
          specialty: storedDoctor.specialty || "",
          doctorId: storedDoctor.doctorId || "",
        }));
      }
    }
  }, [doctor]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const storedUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const patientId = storedUser.userId;

      if (!patientId) {
        toast.error("No patient ID found in localStorage.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        return;
      }

      try {
        const response = await axios.get(`${PATIENT_API_URL}/${patientId}`);
        const patient = response.data.data;

        console.log("Fetched patient data:", patient);

        setForm((prev) => ({
          ...prev,
          name: patient.patientName || "",
          age: patient.age?.toString() || "",
          phone: patient.contactNumber || "",
          email: patient.patientEmail || "",
        }));
      } catch (error) {
        console.error("❌ Failed to fetch patient details:", error);
        toast.error("Could not load patient details", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    };

    fetchPatientDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, phone: numericValue });
    } else if (name === "age") {
      const numericValue = value.replace(/\D/g, "").slice(0, 3);
      setForm({ ...form, age: numericValue });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.name ||
      !form.phone ||
      !form.date ||
      !form.time ||
      !form.reason ||
      !form.doctorId
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const patientId = storedUser.userId;

    if (!patientId) {
      toast.error("Patient not logged in. Please login again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const appointmentDateTime = createAppointmentDateTime(form.date, form.time);

    if (!appointmentDateTime) {
      toast.error("Invalid date or time selected.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    // Primary payload format
    const payload = {
      patientId: patientId,
      doctorId: form.doctorId,
      patientName: form.name,
      age: parseInt(form.age) || 0,
      department: form.specialty,
      patientEmail: form.email,
      appointmentDateTime: appointmentDateTime,
      duration: 30,
      reason: form.reason,
      symptoms: form.reason,
      additionalNotes: form.notes || "",
      emergency: form.emergency,
      phoneNumber: form.phone,
    };

    try {
      setIsSubmitting(true);
      console.log("🎯 Sending appointment request:", payload);

      const response = await makeRequestWithRetry(payload);

      if (response.status === 201 || response.status === 200) {
        console.log("🎉 Success! Appointment created successfully");
        toast.success("Appointment booked successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        setShowConfirmation(true);
      }
    } catch (error) {
      console.log("❌ Request failed:", error);

      // Handle different types of errors
      if (error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          // Conflict - Doctor not available
          const conflictMessage =
            data?.message || "The selected time slot is not available";
          toast.error(`⏰ \n\n${conflictMessage}`, {
            position: "top-center",
            autoClose: 8000, // Longer display for important scheduling info
            theme: "colored",
            style: {
              fontSize: "14px",
              lineHeight: "1.4",
              whiteSpace: "pre-line", // This allows line breaks in the message
            },
          });
        } else if (status === 400) {
          const errorMessage =
            data?.message ||
            "Invalid appointment data. Please check your inputs.";
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
          });
        } else if (status === 404) {
          toast.error(
            "❌ Service not available. Please try again later or contact support.",
            {
              position: "top-center",
              autoClose: 5000,
              theme: "colored",
            }
          );
        } else if (status === 500) {
          toast.error("Server error. Please try again later.", {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
          });
        } else {
          const errorMessage =
            data?.message || "Failed to book appointment. Please try again.";
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
          });
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your internet connection and try again.",
          {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
          }
        );
      } else {
        // This handles the conflict message we throw in makeRequestWithRetry
        if (error.message.includes("is not available at this time")) {
          toast.error(`${error.message}`, {
            position: "top-center",
            autoClose: 8000,
            theme: "colored",
            style: {
              fontSize: "14px",
              lineHeight: "1.4",
              whiteSpace: "pre-line",
            },
          });
        } else {
          toast.error(
            error.message || "An unexpected error occurred. Please try again.",
            {
              position: "top-center",
              autoClose: 3000,
              theme: "colored",
            }
          );
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmClose = () => {
    localStorage.removeItem("selectedDoctor");
    setShowConfirmation(false);
    navigate("/departments/appointment");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-6 mt-12">
      <div className="bg-white max-w-5xl mx-auto shadow-xl rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold pb-4">
            Book Appointment with {form.doctor || "Doctor"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-100 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">👤 Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <input
                name="name"
                required
                placeholder="Full name*"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="age"
                required
                inputMode="numeric"
                maxLength={3}
                placeholder="Age*"
                value={form.age}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone"
                required
                type="tel"
                placeholder="Phone Number*"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                pattern="[0-9]{10}"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Email*"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-100 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">
              👨‍⚕️ Doctor & Appointment Details –{" "}
              <span className="text-blue-600 font-normal">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={form.doctor}
                readOnly
                placeholder="Doctor Name"
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                value={form.specialty}
                readOnly
                placeholder="Department"
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                value={form.doctorId}
                readOnly
                placeholder="Doctor ID"
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg"
              />
              <div></div>
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                min="09:00"
                max="16:30"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="emergency"
                  checked={form.emergency}
                  onChange={handleChange}
                  className="mr-2 rounded"
                />
                <span className="text-red-600 font-medium">
                  Mark as Emergency Appointment
                </span>
              </label>
            </div>
          </div>

          <div className="bg-blue-100 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">❤️ Medical Information</h3>
            <textarea
              name="reason"
              required
              value={form.reason}
              onChange={handleChange}
              placeholder="Describe the symptoms or reason for the appointment...*"
              className="w-full h-24 border border-blue-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-3 font-medium">Additional Notes</p>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any additional notes or special requirements..."
              className="w-full h-20 border border-blue-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-md transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md text-center">
            <h3 className="text-xl font-bold mb-4 text-green-700">
              ✅ Appointment Booked Successfully!
            </h3>
            <p className="mb-2">
              <strong>Patient:</strong> {form.name}
            </p>
            <p className="mb-2">
              <strong>Doctor:</strong> {form.doctor}
            </p>
            <p className="mb-2">
              <strong>Department:</strong> {form.specialty}
            </p>
            <p className="mb-4">
              <strong>Date & Time:</strong> {formatDateForDisplay(form.date)} at{" "}
              {formatTimeForDisplay(form.time)}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              A confirmation email will be sent shortly.
            </p>
            <button
              onClick={handleConfirmClose}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AppointmentPage;
