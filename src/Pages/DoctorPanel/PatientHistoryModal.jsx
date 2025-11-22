import { useEffect, useState } from "react";
import { Button } from "../../components/DoctorPanel/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/DoctorPanel/ui/card";

import {
  MdPerson,
  MdSchedule,
  MdDescription,
  MdCheckCircle,
  MdCancel,
  MdCalendarToday,
  MdClose,
} from "react-icons/md";
//import ViewPrescriptionModal from "./ViewPrescriptionModal";
import { useToast } from "../../hooks/DoctorPanelHooks/use-toast";

// Import your services
import { listCompletedAppointmentsByDoctorId } from '../../services/DoctorPanel/AppointmentService';
import { getPrescriptionByAppointmentId } from '../../services/DoctorPanel/PrescriptionService';
import { Badge } from "../../components/DoctorPanel/ui/badge";
import ViewPrescriptionModal from "../../components/DoctorPanel/ViewPrescriptionModel";

const PatientHistoryModal = ({ isOpen, onClose, patientId, patientName, doctorId }) => {
  const { toast } = useToast();
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState(null);

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchPatientHistory();
    }
  }, [isOpen, doctorId, patientId]);

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch all completed appointments by doctor
      const response = await listCompletedAppointmentsByDoctorId(doctorId);
      const allCompletedAppointments = response.data || [];
      
      // Filter appointments for the specific patient
      let patientAppointments = [];
      
      if (patientId && patientId !== 'undefined') {
        // Filter by specific patient
        patientAppointments = allCompletedAppointments.filter(apt => 
          apt.patientId === patientId || 
          (apt.patient && apt.patient.id === patientId) ||
          (apt.patient && apt.patient.patientId === patientId)
        );
      } else {
        // Show all completed appointments
        patientAppointments = allCompletedAppointments;
      }
      
      // Transform appointments to ensure consistent date/time format
      const transformedAppointments = patientAppointments.map(apt => ({
        ...apt,
        date: apt.appointmentDateTime ? 
          new Date(apt.appointmentDateTime).toISOString().split('T')[0] : 
          apt.date,
        time: apt.appointmentDateTime ? 
          new Date(apt.appointmentDateTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }) : 
          apt.time,
        displayPatientName: apt.patientName || 
                          apt.patient?.name || 
                          apt.patient?.patientName || 
                          "Unknown Patient"
      }));
      
      // Sort by date (most recent first)
      transformedAppointments.sort((a, b) => {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return bDateTime - aDateTime;
      });
      
      setCompletedAppointments(transformedAppointments);
      
    } catch (error) {
      console.error("Error fetching patient history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patient appointment history.",
        variant: "destructive",
      });
      setCompletedAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = async (appointment) => {
    try {
      console.log("Viewing prescription for appointment:", appointment);
      
      // Get appointment ID
      const appointmentId = appointment.appointmentId || appointment.id;
      console.log("Using appointmentId:", appointmentId);
      
      const response = await getPrescriptionByAppointmentId(appointmentId);
      const prescription = response.data;
      
      if (prescription) {
        console.log("Found prescription:", prescription);
        setCurrentPrescription(prescription);
        setShowViewPrescriptionModal(true);
      } else {
        toast({
          title: "No Prescription Found",
          description: "No prescription exists for this appointment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
      
      if (error.response?.status === 404) {
        toast({
          title: "No Prescription Found",
          description: "No prescription exists for this appointment.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error", 
          description: "Failed to fetch prescription. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const variants = {
      completed: "bg-green-100 text-green-700 border-green-200",
      canceled: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return variants[statusLower] || variants.completed;
  };

  const isAppointmentCanceled = (appointment) => {
    const status = appointment.status?.toLowerCase();
    return status === "canceled" || status === "cancelled";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MdCheckCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              {patientId && patientId !== 'undefined' ? `${patientName} - Appointment History` : 'All Appointments History'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <MdClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <MdCheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">Completed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-700">
                  {completedAppointments.filter(apt => !isAppointmentCanceled(apt)).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <MdCancel className="h-4 w-4 text-red-600" />
                  <span className="text-red-700">Cancelled</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-700">
                  {completedAppointments.filter(apt => isAppointmentCanceled(apt)).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <MdCalendarToday className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">Total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-700">
                  {completedAppointments.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading appointment history...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {(!patientId || patientId === 'undefined') && (
                          <th className="text-left p-3 font-medium text-sm">Patient</th>
                        )}
                        <th className="text-left p-3 font-medium text-sm">Date & Time</th>
                        <th className="text-left p-3 font-medium text-sm">Reason</th>
                        <th className="text-left p-3 font-medium text-sm">Status</th>
                        <th className="text-left p-3 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={(!patientId || patientId === 'undefined') ? 5 : 4} className="text-center p-8 text-gray-500">
                            {patientId && patientId !== 'undefined' 
                              ? `No appointment history found for ${patientName}.`
                              : 'No completed appointments found.'
                            }
                          </td>
                        </tr>
                      ) : (
                        completedAppointments.map((appointment) => (
                          <tr key={appointment.appointmentId || appointment.id} className="border-b hover:bg-muted/25">
                            {(!patientId || patientId === 'undefined') && (
                              <td className="p-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <MdPerson className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-xs">{appointment.displayPatientName}</p>
                                    <p className="text-xs text-gray-500">
                                      ID: {appointment.patientId || appointment.patient?.id || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            )}
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <MdSchedule className="h-3 w-3 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-xs">{appointment.date}</p>
                                  <p className="font-medium text-xs">{appointment.time}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{appointment.reason || 'General Consultation'}</td>
                            <td className="p-3 text-sm">
                              <Badge className={`border text-xs ${getStatusBadge(appointment.status)}`}>
                                {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <Button
                                size="sm"
                                variant="outline"
                                className={`text-xs h-7 ${
                                  isAppointmentCanceled(appointment)
                                    ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                                    : ""
                                }`}
                                onClick={() => handleViewPrescription(appointment)}
                                disabled={isAppointmentCanceled(appointment)}
                                title={
                                  isAppointmentCanceled(appointment)
                                    ? "Prescription cannot be viewed for cancelled appointments"
                                    : "View Prescription"
                                }
                              >
                                <MdDescription className="h-3 w-3 mr-1" />
                                View Prescription
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Prescription Modal */}
      {showViewPrescriptionModal && currentPrescription && (
        <ViewPrescriptionModal
          isOpen={showViewPrescriptionModal}
          onClose={() => {
            setShowViewPrescriptionModal(false);
            setCurrentPrescription(null);
          }}
          prescription={currentPrescription}
        />
      )}
    </div>
  );
};

export default PatientHistoryModal;