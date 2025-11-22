import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  MdCalendarToday,
  MdPerson,
  MdCheckCircle,
  MdSchedule,
  MdDescription,
  MdVisibility,
  MdRefresh,
  MdCancel,
  MdEdit,
  MdClose,
} from "react-icons/md";
import { AppointmentCard } from "./AppointmentCard";
import { PatientDetailsModal } from "./PatientDetailsModal";
import PrescribeModal from "./PrescribeModal";
import ViewPrescriptionModal from "./ViewPrescriptionModel";
import PatientHistoryModal from "../../Pages/DoctorPanel/PatientHistoryModal";
import EditPrescribeModal from "./EditPrescribeModal";
import {
  listUpcomingAppointmentsByDoctorId,
  listCompletedAppointmentsByDoctorId,
  createRevisitAppointment,
  cancelAppointmentById,
} from "../../services/DoctorPanel/AppointmentService";
import { getPrescriptionByAppointmentId } from "../../services/DoctorPanel/PrescriptionService";

// Custom Toast Component
const CustomToast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [onClose, toast.duration]);

  const getToastStyles = (variant) => {
    const styles = {
      destructive: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      default: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return styles[variant] || styles.default;
  };

  const getIconColor = (variant) => {
    const colors = {
      destructive: 'text-red-600',
      success: 'text-green-600',
      default: 'text-blue-600'
    };
    return colors[variant] || colors.default;
  };

  return (
    <div className={`fixed top-4 right-4 z-[9999] max-w-sm w-full border rounded-lg shadow-lg p-4 ${getToastStyles(toast.variant)}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm mt-1 opacity-90">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`ml-2 p-1 rounded-full hover:bg-black/10 transition-colors ${getIconColor(toast.variant)}`}
        >
          <MdClose className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Custom useToast hook
const useCustomToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, variant, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toast, toasts, removeToast };
};

export const MedicalAppointments = ({ onModalToggle }) => {
  const { toast, toasts, removeToast } = useCustomToast();
  const { id: doctorId } = useParams();

  // State variables
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [viewHistoryPatient, setViewHistoryPatient] = useState(null);
  const [cancelAppointment, setCancelAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [revisitAppointment, setRevisitAppointment] = useState(null);
  const [revisitDate, setRevisitDate] = useState("");
  const [revisitTime, setRevisitTime] = useState(null);
  const [revisitReason, setRevisitReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditPrescriptionModal, setShowEditPrescriptionModal] = useState(false);
  const [editPrescriptionData, setEditPrescriptionData] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [isSubmittingRevisit, setIsSubmittingRevisit] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Track modal states for parent component
  useEffect(() => {
    const isAnyModalOpen = 
      showPrescribeModal ||
      showViewPrescriptionModal ||
      showEditPrescriptionModal ||
      !!selectedPatient ||
      !!revisitAppointment ||
      !!cancelAppointment ||
      !!viewHistoryPatient;

    onModalToggle?.(isAnyModalOpen);
  }, [
    showPrescribeModal,
    showViewPrescriptionModal,
    showEditPrescriptionModal,
    selectedPatient,
    revisitAppointment,
    cancelAppointment,
    viewHistoryPatient,
    onModalToggle
  ]);

  // Helper functions
  const getRowKey = (appointment) => {
    return appointment.appointmentId || appointment._id || appointment.id;
  };

  const getAppointmentIdForPrescription = (appointment) => {
    return appointment.appointmentId || appointment.id;
  };

  const isAppointmentCanceled = (appointment) => {
    const status = appointment.status?.toUpperCase();
    return status === "CANCELED" || status === "CANCELLED";
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const showToast = (title, description, variant = "default") => {
    toast({ title, description, variant, duration: 5000 });
  };

  // Computed appointment arrays
  const upcomingAppointments = (() => {
    const upcoming = allAppointments.filter((apt) => {
      const status = apt.status?.toUpperCase();
      return status === "PENDING" || status === "CONFIRMED" || status === "ACCEPTED";
    });

    const seen = new Set();
    const unique = upcoming.filter(apt => {
      const key = getRowKey(apt);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => {
      const parseDateTime = (appointment) => {
        try {
          if (appointment.appointmentDateTime) {
            return new Date(appointment.appointmentDateTime);
          } else {
            const dateTime = new Date(`${appointment.date} ${appointment.time}`);
            return isNaN(dateTime.getTime()) ? new Date(0) : dateTime;
          }
        } catch (error) {
          return new Date(0);
        }
      };
      return parseDateTime(a) - parseDateTime(b);
    });
  })();

  const appointmentHistory = (() => {
    const history = allAppointments.filter((apt) => {
      const status = apt.status?.toUpperCase();
      return status === "COMPLETED" || status === "CANCELED" || status === "CANCELLED";
    });

    const seen = new Set();
    const unique = history.filter(apt => {
      const key = getRowKey(apt);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => {
      const aDateTime = new Date(`${a.date} ${a.time}`);
      const bDateTime = new Date(`${b.date} ${b.time}`);
      return bDateTime - aDateTime;
    });
  })();

  const completedAppointments = allAppointments.filter((apt) => {
    const status = apt.status?.toUpperCase();
    return status === "COMPLETED";
  });

  const canceledAppointments = allAppointments.filter((apt) => {
    const status = apt.status?.toUpperCase();
    return status === "CANCELED" || status === "CANCELLED";
  });

  // Fetch appointments on component mount
  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const [upcomingResponse, completedResponse] = await Promise.allSettled([
        listUpcomingAppointmentsByDoctorId(doctorId),
        listCompletedAppointmentsByDoctorId(doctorId)
      ]);

      let allFetchedAppointments = [];

      if (upcomingResponse.status === 'fulfilled') {
        const upcomingData = upcomingResponse.value.data;
        const upcomingAppointments = Array.isArray(upcomingData) 
          ? upcomingData 
          : upcomingData.appointments || [];
        allFetchedAppointments = [...allFetchedAppointments, ...upcomingAppointments];
      }

      if (completedResponse.status === 'fulfilled') {
        const completedData = completedResponse.value.data;
        const completedAppointments = Array.isArray(completedData) 
          ? completedData 
          : completedData.appointments || [];
        allFetchedAppointments = [...allFetchedAppointments, ...completedAppointments];
      }

      const parseDateTime = (dateTimeValue) => {
        if (!dateTimeValue) return null;
        
        try {
          let parsedDate;
          
          if (Array.isArray(dateTimeValue) && dateTimeValue.length >= 3) {
            const [year, month, day, hour = 0, minute = 0] = dateTimeValue;
            parsedDate = new Date(year, month - 1, day, hour, minute);
          } else if (typeof dateTimeValue === 'string') {
            parsedDate = new Date(dateTimeValue);
          } else if (dateTimeValue instanceof Date) {
            parsedDate = dateTimeValue;
          } else {
            parsedDate = new Date(dateTimeValue);
          }
          
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        } catch (error) {
          return null;
        }
      };

      const formatTime = (dateTime) => {
        if (!dateTime) return "12:00 AM";
        
        try {
          return dateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch (error) {
          return "12:00 AM";
        }
      };

      const formatDate = (dateTime) => {
        if (!dateTime) return new Date().toISOString().split("T")[0];
        
        try {
          return dateTime.toISOString().split("T")[0];
        } catch (error) {
          return new Date().toISOString().split("T")[0];
        }
      };

      const transformedAppointments = allFetchedAppointments.map((apt) => {
        try {
          let appointmentDate = null;
          let appointmentTime = "12:00 AM";
          
          if (apt.appointmentDateTime) {
            const parsedDateTime = parseDateTime(apt.appointmentDateTime);
            if (parsedDateTime) {
              appointmentDate = formatDate(parsedDateTime);
              appointmentTime = formatTime(parsedDateTime);
            }
          }
          
          if (!appointmentDate && apt.date) {
            const parsedDate = parseDateTime(apt.date);
            if (parsedDate) {
              appointmentDate = formatDate(parsedDate);
              if (appointmentTime === "12:00 AM" && apt.time) {
                appointmentTime = apt.time;
              }
            }
          }
          
          if (apt.time && appointmentTime === "12:00 AM") {
            appointmentTime = apt.time;
          }
          
          if (!appointmentDate) {
            appointmentDate = new Date().toISOString().split("T")[0];
          }

          return {
            ...apt,
            date: appointmentDate,
            time: appointmentTime,
            status: apt.status?.toLowerCase() || "pending",
          };
        } catch (error) {
          return {
            ...apt,
            date: new Date().toISOString().split("T")[0],
            time: "12:00 AM",
            status: apt.status?.toLowerCase() || "pending",
          };
        }
      });

      const seen = new Set();
      const uniqueAppointments = transformedAppointments.filter(apt => {
        const key = getRowKey(apt);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setAllAppointments(uniqueAppointments);

    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAllAppointments([]);
      showToast(
        "Error",
        "Failed to fetch appointments. Please refresh the page.",
        "destructive"
      );
    }
  };

  // Event handlers
  const handleRevisit = (appointment) => {
    setRevisitAppointment(appointment);
    setRevisitDate("");
    setRevisitTime(null);
    setRevisitReason("");
  };

  const handleEditPrescription = async (appointment) => {
    if (isAppointmentCanceled(appointment)) {
      showToast(
        "Cannot Edit Prescription",
        "Prescriptions cannot be edited for canceled appointments.",
        "destructive"
      );
      return;
    }

    try {
      const appointmentId = getAppointmentIdForPrescription(appointment);
      const response = await getPrescriptionByAppointmentId(appointmentId);
      const prescription = response.data;

      if (prescription) {
        setEditPrescriptionData({
          prescription: prescription,
          appointmentId: appointmentId,
          doctorId: doctorId,
          patientId: appointment.patientId || appointment.patient?.id,
          patientName: appointment.patientName || appointment.patient?.name,
        });
        setShowEditPrescriptionModal(true);
      } else {
        showToast(
          "No Prescription Found",
          "No prescription exists for this appointment to edit.",
          "destructive"
        );
      }
    } catch (error) {
      showToast(
        "Error",
        "Failed to fetch prescription for editing. Please try again.",
        "destructive"
      );
    }
  };

  const handleEditPrescriptionSuccess = async () => {
    showToast("Success", "Prescription updated successfully!", "success");
    setShowEditPrescriptionModal(false);
    setEditPrescriptionData(null);
    setTimeout(async () => {
      await fetchAppointments();
    }, 1000);
  };

  const handleViewHistory = (appointment) => {
    const patientId = appointment.patientId || appointment.patient?.id;
    const patientName = appointment.patientName || appointment.patient?.name;
    setViewHistoryPatient({ id: patientId, name: patientName });
  };

const handleRevisitConfirm = async () => {
  if (!revisitDate || !revisitTime || !revisitReason.trim()) {
    showToast(
      "Error",
      "Please fill in all fields for the revisit appointment.",
      "destructive"
    );
    return;
  }

  // Validate business hours (9 AM to 5 PM)
  const selectedHour = revisitTime.getHours();
  const selectedMinute = revisitTime.getMinutes();
  
  if (selectedHour < 9 || selectedHour > 17 || (selectedHour === 17 && selectedMinute > 0)) {
    showToast(
      "Error Creating Revisit",
      "Appointments must be between 9:00 AM and 5:00 PM",
      "destructive"
    );
    return;
  }

  setIsSubmittingRevisit(true);

  try {
    const appointmentDateTime = new Date(revisitDate);
    appointmentDateTime.setHours(revisitTime.getHours());
    appointmentDateTime.setMinutes(revisitTime.getMinutes());
    appointmentDateTime.setSeconds(0);
    appointmentDateTime.setMilliseconds(0);

    const year = appointmentDateTime.getFullYear();
    const month = String(appointmentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(appointmentDateTime.getDate()).padStart(2, '0');
    const hour = String(appointmentDateTime.getHours()).padStart(2, '0');
    const minute = String(appointmentDateTime.getMinutes()).padStart(2, '0');
    const second = String(appointmentDateTime.getSeconds()).padStart(2, '0');
    
    const localDateString = `${year}-${month}-${day}`;
    const localTimeString = `${hour}:${minute}:${second}`;

    // ✅ FIXED: Send complete patient data to ensure backend has all information
    const revisitData = {
      newDate: localDateString,
      newTime: localTimeString,
      reason: revisitReason.trim(),
      // ✅ CRITICAL: Include ALL patient information from original appointment
      originalAppointmentId: revisitAppointment.appointmentId || revisitAppointment.id,
      patientId: revisitAppointment.patientId || revisitAppointment.patient?.id,
      patientName: revisitAppointment.patientName || revisitAppointment.patient?.name || revisitAppointment.patient?.patientName,
      patientEmail: revisitAppointment.patientEmail || revisitAppointment.patient?.email,
      patientPhone: revisitAppointment.patientPhone || revisitAppointment.patient?.phone || revisitAppointment.patient?.phoneNumber,
      age: revisitAppointment.age || revisitAppointment.patient?.age || revisitAppointment.patientAge || 25, // Default age if not available
      gender: revisitAppointment.gender || revisitAppointment.patient?.gender,
      doctorId: revisitAppointment.doctorId,
      doctorName: revisitAppointment.doctorName,
      duration: revisitAppointment.duration || 30, // Default 30 minutes if not specified
      // ✅ ADD: Additional fields that might be needed
      originalReason: revisitAppointment.reason,
      emergency: revisitAppointment.emergency || false
    };

    console.log("=== REVISIT DEBUG INFO ===");
    console.log("Original appointment object:", revisitAppointment);
    console.log("Sending revisit data:", revisitData);
    console.log("Patient Name:", revisitData.patientName);
    console.log("Patient Email:", revisitData.patientEmail);
    console.log("Patient Age:", revisitData.age);
    console.log("========================");

    // ✅ VALIDATION: Check if we have required data before sending
    if (!revisitData.patientName || revisitData.patientName.trim() === '') {
      throw new Error("Patient name is missing from appointment data");
    }
    
    if (!revisitData.patientEmail || revisitData.patientEmail.trim() === '') {
      throw new Error("Patient email is missing from appointment data");
    }

    const appointmentId = revisitAppointment.appointmentId || revisitAppointment.id;
    const response = await createRevisitAppointment(appointmentId, revisitData);
    
    console.log("Revisit response:", response);
    
    showToast(
      "Follow-up Appointment Created Successfully",
      `New follow-up appointment scheduled for ${revisitData.patientName} on ${format(appointmentDateTime, "MMM dd, yyyy")} at ${appointmentDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit", 
        hour12: true,
      })}. Email confirmation has been sent to the patient.`,
      "success"
    );

    setRevisitAppointment(null);
    setRevisitDate("");
    setRevisitTime(null);
    setRevisitReason("");

    setTimeout(async () => {
      await fetchAppointments();
    }, 1000);

  } catch (error) {
    console.error("Error creating revisit:", error);
    
    let errorMessage = "Failed to create revisit appointment";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showToast("Error Creating Revisit", errorMessage, "destructive");
  } finally {
    setIsSubmittingRevisit(false);
  }
};

  const handlePrescriptionSuccess = async () => {
    showToast(
      "Success",
      "Prescription created successfully! Appointment moved to history.",
      "success"
    );
    setShowPrescribeModal(false);
    setSelectedAppointment(null);
    setTimeout(async () => {
      await fetchAppointments();
    }, 1000);
  };

  const handleViewPrescription = async (appointment) => {
    if (isAppointmentCanceled(appointment)) {
      showToast(
        "Cannot View Prescription",
        "Prescriptions cannot be viewed for canceled appointments.",
        "destructive"
      );
      return;
    }

    try {
      const appointmentId = getAppointmentIdForPrescription(appointment);
      const response = await getPrescriptionByAppointmentId(appointmentId);
      const prescription = response.data;

      if (prescription) {
        setCurrentPrescription(prescription);
        setShowViewPrescriptionModal(true);
      } else {
        showToast(
          "No Prescription Found",
          "No prescription exists for this appointment.",
          "destructive"
        );
      }
    } catch (error) {
      showToast(
        "Error",
        "Failed to fetch prescription. Please try again.",
        "destructive"
      );
    }
  };

  const handleCreatePrescription = (appointment) => {
    let patientId = null;
    let patientName = null;

    if (appointment.patientId) {
      patientId = appointment.patientId;
    } else if (appointment.patient?.id) {
      patientId = appointment.patient.id;
    } else if (appointment.patient?.patientId) {
      patientId = appointment.patient.patientId;
    }

    if (appointment.patientName) {
      patientName = appointment.patientName;
    } else if (appointment.patient?.name) {
      patientName = appointment.patient.name;
    } else if (appointment.patient?.patientName) {
      patientName = appointment.patient.patientName;
    }

    if (!patientId || !patientName) {
      showToast(
        "Error",
        "Cannot create prescription: Patient information is missing from appointment data.",
        "destructive"
      );
      return;
    }

    setSelectedAppointment({
      ...appointment,
      patientId: patientId,
      patientName: patientName,
    });
    setShowPrescribeModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-green-100 text-green-700 border-green-200",
    };
    return variants[status] || variants.pending;
  };

// ✅ IMPROVED: Better cancel confirmation with validation
const handleCancelConfirm = async () => {
  if (!cancelReason.trim()) {
    showToast(
      "Error",
      "Please provide a reason for cancellation.",
      "destructive"
    );
    return;
  }

  setIsCancelling(true);

  try {
    console.log("Cancelling appointment:", {
      id: cancelAppointment.appointmentId || cancelAppointment.id,
      reason: cancelReason.trim(),
      patientEmail: cancelAppointment.patientEmail,
      patientName: cancelAppointment.patientName
    }); // Debug log

    const response = await cancelAppointmentById(
      cancelAppointment.appointmentId || cancelAppointment.id,
      cancelReason.trim()
    );

    console.log("Cancel response:", response); // Debug log

    showToast(
      "Appointment Cancelled",
      `Appointment for ${cancelAppointment.patientName} has been cancelled. Email notification sent with reason.`,
      "success"
    );

    setCancelAppointment(null);
    setCancelReason("");

    setTimeout(async () => {
      await fetchAppointments();
    }, 1000);

  } catch (error) {
    console.error("Error cancelling appointment:", error); // Debug log
    
    let errorMessage = "Failed to cancel appointment. Please try again.";
    if (error.response?.status === 400) {
      errorMessage = "Invalid cancellation reason provided.";
    } else if (error.response?.status === 404) {
      errorMessage = "Appointment not found.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    showToast("Error", errorMessage, "destructive");
  } finally {
    setIsCancelling(false);
  }
};

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AppointmentCard
            title="Upcoming Appointments"
            count={upcomingAppointments.length}
            icon={<MdCalendarToday className="h-6 w-6 text-primary" />}
            bgColor="bg-medical-blue-light"
          />
          <AppointmentCard
            title="Completed"
            count={completedAppointments.length}
            icon={<MdCheckCircle className="h-6 w-6 text-green-600" />}
            bgColor="bg-green-50"
          />
          <AppointmentCard
            title="Canceled"
            count={canceledAppointments.length}
            icon={<MdCancel className="h-6 w-6 text-red-600" />}
            bgColor="bg-red-50"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Upcoming Appointments
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Appointment History
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardContent className="p-0">
                <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <MdCalendarToday className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">
                      Upcoming Appointments
                    </h3>
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-white/20 text-white"
                    >
                      {upcomingAppointments.length} appointments
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium w-[200px]">Patient</th>
                        <th className="text-left p-3 font-medium w-[140px]">Date & Time</th>
                        <th className="text-left p-3 font-medium w-[150px]">Reason</th>
                        <th className="text-left p-3 font-medium w-[100px]">Status</th>
                        <th className="text-left p-3 font-medium w-[310px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-8 text-gray-500">
                            No pending appointments found for this doctor.
                          </td>
                        </tr>
                      ) : (
                        upcomingAppointments.map((appointment) => (
                          <tr
                            key={getRowKey(appointment)}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <MdPerson className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate">
                                    {appointment.patientName}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    ID: {getAppointmentIdForPrescription(appointment)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <MdSchedule className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-xs">{appointment.date}</p>
                                  <p className="font-medium text-xs">{appointment.time}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="max-w-[150px]">
                                <span
                                  className="block truncate"
                                  title={appointment.reason}
                                >
                                  {truncateText(appointment.reason, 25)}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <Badge
                                className={`border text-xs ${getStatusBadge(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center gap-1 flex-nowrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                                  onClick={() => handleCreatePrescription(appointment)}
                                >
                                  <MdDescription className="h-3 w-3 mr-1" />
                                  Prescription
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                                  onClick={() => handleViewHistory(appointment)}
                                >
                                  <MdVisibility className="h-3 w-3 mr-1" />
                                  History
                                </Button>

                                <button
                                  className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors h-7 whitespace-nowrap"
                                  onClick={() => handleRevisit(appointment)}
                                >
                                  <MdRefresh className="h-3 w-3 mr-1 inline" />
                                  Revisit
                                </button>

                                <button
                                  className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors h-7 whitespace-nowrap"
                                  onClick={() => setCancelAppointment(appointment)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointment History Tab */}
          <TabsContent value="history">
            <Card>
              <CardContent className="p-0">
                <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <MdCheckCircle className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Appointment History</h3>
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-white/20 text-white"
                    >
                      {appointmentHistory.length} completed
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium w-[200px]">Patient</th>
                        <th className="text-left p-3 font-medium w-[140px]">Date & Time</th>
                        <th className="text-left p-3 font-medium w-[150px]">Reason</th>
                        <th className="text-left p-3 font-medium w-[100px]">Status</th>
                        <th className="text-left p-3 font-medium w-[210px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-8 text-gray-500">
                            No completed appointments found for this doctor.
                          </td>
                        </tr>
                      ) : (
                        appointmentHistory.map((appointment) => (
                          <tr
                            key={getRowKey(appointment)}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <MdPerson className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate">
                                    {appointment.patientName}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    ID: {getAppointmentIdForPrescription(appointment)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <MdSchedule className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-xs">{appointment.date}</p>
                                  <p className="font-medium text-xs">{appointment.time}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="max-w-[150px]">
                                <span
                                  className="block truncate"
                                  title={appointment.reason}
                                >
                                  {truncateText(appointment.reason, 25)}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <Badge
                                className={`border text-xs ${getStatusBadge(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`text-xs px-2 py-1 h-7 whitespace-nowrap ${
                                    isAppointmentCanceled(appointment)
                                      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                                      : ""
                                  }`}
                                  onClick={() => handleViewPrescription(appointment)}
                                  disabled={isAppointmentCanceled(appointment)}
                                  title={
                                    isAppointmentCanceled(appointment)
                                      ? "Prescription cannot be viewed for canceled appointments"
                                      : "View Prescription"
                                  }
                                >
                                  <MdDescription className="h-3 w-3 mr-1" />
                                  Prescription
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`text-xs px-2 py-1 h-7 whitespace-nowrap ${
                                    isAppointmentCanceled(appointment)
                                      ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                                      : "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                                  }`}
                                  onClick={() => handleEditPrescription(appointment)}
                                  disabled={isAppointmentCanceled(appointment)}
                                  title={
                                    isAppointmentCanceled(appointment)
                                      ? "Prescription cannot be edited for canceled appointments"
                                      : "Edit Prescription"
                                  }
                                >
                                  <MdEdit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <PatientDetailsModal
            isOpen={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
            patient={selectedPatient}
          />
        </div>
      )}

      {showPrescribeModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <PrescribeModal
            isOpen={showPrescribeModal}
            appointmentId={getAppointmentIdForPrescription(selectedAppointment)}
            doctorId={doctorId}
            patientId={selectedAppointment.patientId}
            patientName={selectedAppointment.patientName}
            onClose={() => {
              setShowPrescribeModal(false);
              setSelectedAppointment(null);
            }}
            onSuccess={handlePrescriptionSuccess}
          />
        </div>
      )}

      {showViewPrescriptionModal && currentPrescription && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <ViewPrescriptionModal
            isOpen={showViewPrescriptionModal}
            onClose={() => {
              setShowViewPrescriptionModal(false);
              setCurrentPrescription(null);
            }}
            prescription={currentPrescription}
          />
        </div>
      )}

      {viewHistoryPatient && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <PatientHistoryModal
            isOpen={!!viewHistoryPatient}
            onClose={() => setViewHistoryPatient(null)}
            patientId={viewHistoryPatient.id}
            patientName={viewHistoryPatient.name}
            doctorId={doctorId}
          />
        </div>
      )}

      {showEditPrescriptionModal && editPrescriptionData && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <EditPrescribeModal
            isOpen={showEditPrescriptionModal}
            appointmentId={editPrescriptionData.appointmentId}
            doctorId={editPrescriptionData.doctorId}
            patientId={editPrescriptionData.patientId}
            patientName={editPrescriptionData.patientName}
            existingPrescription={editPrescriptionData.prescription}
            onClose={() => {
              setShowEditPrescriptionModal(false);
              setEditPrescriptionData(null);
            }}
            onSuccess={handleEditPrescriptionSuccess}
          />
        </div>
      )}

      {/* Revisit Modal */}
      {revisitAppointment && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-blue-600">Schedule Revisit</h2>
            <p className="text-sm text-gray-600">
              Schedule a follow-up appointment for{" "}
              <strong>
                {revisitAppointment.patient?.name || revisitAppointment.patientName}
              </strong>
              .
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded p-2 text-sm"
                  value={revisitDate}
                  onChange={(e) => setRevisitDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  disabled={isSubmittingRevisit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (9:00 AM - 4:00 PM)
                </label>
                <select
                  className="w-full border rounded p-2 text-sm"
                  value={revisitTime ? revisitTime.toTimeString().slice(0, 5) : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const timeDate = new Date();
                    timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    setRevisitTime(timeDate);
                  }}
                  disabled={isSubmittingRevisit}
                  style={{ maxHeight: '120px', overflowY: 'auto' }}
                >
                  <option value="">Select time...</option>
                  {(() => {
                    const times = [];
                    for (let hour = 9; hour <= 16; hour++) {
                      for (let minute = 0; minute < 60; minute += 60) {
                        if (hour === 17 && minute > 0) break;
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });
                        times.push(
                          <option key={timeString} value={timeString}>
                            {displayTime}
                          </option>
                        );
                      }
                    }
                    return times;
                  })()}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Business hours: 9:00 AM to 4:00 PM (Hourly slots)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Revisit
                </label>
                <textarea
                  rows={3}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Enter reason for follow-up appointment..."
                  value={revisitReason}
                  onChange={(e) => setRevisitReason(e.target.value)}
                  disabled={isSubmittingRevisit}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setRevisitAppointment(null);
                  setRevisitDate("");
                  setRevisitTime(null);
                  setRevisitReason("");
                }}
                disabled={isSubmittingRevisit}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                  !revisitDate ||
                  !revisitTime ||
                  !revisitReason.trim() ||
                  isSubmittingRevisit
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  !revisitDate ||
                  !revisitTime ||
                  !revisitReason.trim() ||
                  isSubmittingRevisit
                }
                onClick={handleRevisitConfirm}
              >
                {isSubmittingRevisit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Schedule Revisit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {cancelAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MdCancel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Cancel Appointment</h2>
                  <p className="text-red-100 text-sm">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Patient Info Card */}
              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-400">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <MdPerson className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {cancelAppointment.patientName}
                    </h3>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p className="flex items-center">
                        <MdCalendarToday className="h-3 w-3 mr-1" />
                        {cancelAppointment.date} at {cancelAppointment.time}
                      </p>
                      <p className="flex items-center">
                        <MdDescription className="h-3 w-3 mr-1" />
                        {cancelAppointment.reason || 'General consultation'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Why are you cancelling this appointment?
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  {/* Quick reason buttons */}
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {[
                      'Doctor unavailable',
                      'Emergency situation', 
                      'Facility maintenance',
                      'Personal emergency',
                      'Equipment issue',
                      'Other'
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setCancelReason(reason === 'Other' ? '' : reason)}
                        className={`p-1.5 text-xs rounded border transition-all duration-200 ${
                          cancelReason === reason
                            ? 'bg-red-100 border-red-300 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                        disabled={isCancelling}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                    placeholder="Additional details (will be sent to patient via email)..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    disabled={isCancelling}
                    maxLength={200}
                  />
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {cancelReason.length}/200 characters
                    </span>
                    {!cancelReason.trim() && (
                      <span className="text-xs text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                        Reason required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 text-sm">📧</span>
                  <p className="text-xs text-blue-700">
                    Patient will receive email notification and can reschedule through our portal.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-1">
                <button
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  onClick={() => {
                    setCancelAppointment(null);
                    setCancelReason("");
                  }}
                  disabled={isCancelling}
                >
                  Keep Appointment
                </button>
                
                <button
                  className={`flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2 ${
                    !cancelReason.trim() || isCancelling ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!cancelReason.trim() || isCancelling}
                  onClick={handleCancelConfirm}
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <MdCancel className="h-3 w-3" />
                      <span>Cancel Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};