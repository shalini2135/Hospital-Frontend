import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Stethoscope,
  FileText,
  Search,
  CheckCircle,
  Pill
} from "lucide-react";
import PatientHistory  from "./PatientHistory";


const CompletedTreatments = () => {
  const [completedPrescriptions, setCompletedPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const mockPrescriptions = [
  {
    id: "1",
    prescriptionNumber: "RX-2025-001",
    date: "2025-01-15",
    time: "10:30",
    doctor: {
      id: "doc1",
      name: "Dr. Smith",
      department: "Cardiology",
      specialization: "Interventional Cardiology",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "completed",
    medications: [
      {
        id: "med1",
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with dinner",
        quantity: 30,
        unitPrice: 1.25,
        totalPrice: 37.5,
      },
      {
        id: "med2",
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food",
        quantity: 30,
        unitPrice: 0.15,
        totalPrice: 4.5,
      },
    ],
    billing: {
      billId: "BILL-2025-001",
      billDate: "2025-01-15",
      consultationFee: 150.0,
      medicationTotal: 42.0,
      pharmacyFee: 5.0,
      subtotal: 197.0,
      tax: 15.76,
      discount: 10.0,
      insuranceCoverage: 150.0,
      finalAmount: 52.76,
      paymentStatus: "paid",
      paymentDate: "2025-01-15",
      paymentMethod: "Credit Card",
    },
    diagnosis: "Hypertension and high cholesterol",
    notes: "Patient advised to reduce salt intake and exercise regularly",
    nextFollowUp: "2025-02-15",
    pharmacyName: "City Pharmacy",
    dispensedDate: "2025-01-15",
    totalAmount: 52.76,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    prescriptionNumber: "RX-2025-002",
    date: "2025-01-10",
    time: "15:00",
    doctor: {
      id: "doc2",
      name: "Dr. Patel",
      department: "Dermatology",
      specialization: "Clinical Dermatology",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "ongoing",
    medications: [
      {
        id: "med3",
        name: "Hydrocortisone Cream",
        dosage: "1%",
        frequency: "Apply twice daily",
        duration: "14 days",
        instructions: "Apply thin layer to affected area",
        quantity: 1,
        unitPrice: 22.0,
        totalPrice: 22.0,
      },
    ],
    billing: {
      billId: "BILL-2025-002",
      billDate: "2025-01-10",
      consultationFee: 120.0,
      medicationTotal: 22.0,
      pharmacyFee: 3.0,
      subtotal: 145.0,
      tax: 11.6,
      discount: 0.0,
      insuranceCoverage: 100.0,
      finalAmount: 56.6,
      paymentStatus: "pending",
      paymentDate: null,
      paymentMethod: null,
    },
    diagnosis: "Eczema on hands",
    notes: "Avoid harsh soaps and use moisturizer regularly",
    nextFollowUp: "2025-01-24",
    pharmacyName: "Health Plus Pharmacy",
    dispensedDate: "2025-01-10",
    totalAmount: 56.6,
    createdAt: "2025-01-10T15:00:00Z",
    updatedAt: "2025-01-10T15:00:00Z",
  },
  {
    id: "3",
    prescriptionNumber: "RX-2025-003",
    date: "2025-01-05",
    time: "11:00",
    doctor: {
      id: "doc3",
      name: "Dr. Rana",
      department: "Neurology",
      specialization: "Headache Medicine",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "completed",
    medications: [
      {
        id: "med4",
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        duration: "30 days",
        instructions: "Take at onset of migraine",
        quantity: 9,
        unitPrice: 4.5,
        totalPrice: 40.5,
      },
      {
        id: "med5",
        name: "Propranolol",
        dosage: "40mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals",
        quantity: 60,
        unitPrice: 0.85,
        totalPrice: 51.0,
      },
    ],
    billing: {
      billId: "BILL-2025-003",
      billDate: "2025-01-05",
      consultationFee: 175.0,
      medicationTotal: 91.5,
      pharmacyFee: 7.0,
      subtotal: 273.5,
      tax: 21.88,
      discount: 25.0,
      insuranceCoverage: 200.0,
      finalAmount: 70.38,
      paymentStatus: "paid",
      paymentDate: "2025-01-05",
      paymentMethod: "Insurance + Credit Card",
    },
    diagnosis: "Migraine headaches",
    notes: "Patient should maintain headache diary and avoid known triggers",
    nextFollowUp: "2025-02-05",
    pharmacyName: "Downtown Pharmacy",
    dispensedDate: "2025-01-05",
    totalAmount: 70.38,
    createdAt: "2025-01-05T11:00:00Z",
    updatedAt: "2025-01-05T11:00:00Z",
  },
  {
    id: "4",
    prescriptionNumber: "RX-2025-004",
    date: "2025-01-20",
    time: "09:30",
    doctor: {
      id: "doc4",
      name: "Dr. Johnson",
      department: "Family Medicine",
      specialization: "Primary Care",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "ongoing",
    medications: [
      {
        id: "med6",
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "10 days",
        instructions: "Take with food to avoid stomach upset",
        quantity: 30,
        unitPrice: 0.75,
        totalPrice: 22.5,
      },
    ],
    billing: {
      billId: "BILL-2025-004",
      billDate: "2025-01-20",
      consultationFee: 100.0,
      medicationTotal: 22.5,
      pharmacyFee: 2.5,
      subtotal: 125.0,
      tax: 10.0,
      discount: 15.0,
      insuranceCoverage: 80.0,
      finalAmount: 40.0,
      paymentStatus: "overdue",
      paymentDate: null,
      paymentMethod: null,
    },
    diagnosis: "Bacterial sinusitis",
    notes: "Complete full course of antibiotics even if symptoms improve",
    nextFollowUp: "2025-01-30",
    pharmacyName: "City Pharmacy",
    dispensedDate: "2025-01-20",
    totalAmount: 40.0,
    createdAt: "2025-01-20T09:30:00Z",
    updatedAt: "2025-01-20T09:30:00Z",
  },
  {
    id: "5",
    prescriptionNumber: "RX-2025-005",
    date: "2025-01-12",
    time: "14:45",
    doctor: {
      id: "doc5",
      name: "Dr. Williams",
      department: "Orthopedics",
      specialization: "Sports Medicine",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "completed",
    medications: [
      {
        id: "med7",
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take with food, do not exceed recommended dose",
        quantity: 21,
        unitPrice: 0.5,
        totalPrice: 10.5,
      },
      {
        id: "med8",
        name: "Muscle Relaxant Gel",
        dosage: "2%",
        frequency: "Apply as needed",
        duration: "14 days",
        instructions: "Apply to affected area, massage gently",
        quantity: 1,
        unitPrice: 18.0,
        totalPrice: 18.0,
      },
    ],
    billing: {
      billId: "BILL-2025-005",
      billDate: "2025-01-12",
      consultationFee: 140.0,
      medicationTotal: 28.5,
      pharmacyFee: 4.0,
      subtotal: 172.5,
      tax: 13.8,
      discount: 20.0,
      insuranceCoverage: 120.0,
      finalAmount: 46.3,
      paymentStatus: "paid",
      paymentDate: "2025-01-12",
      paymentMethod: "Debit Card",
    },
    diagnosis: "Lower back strain from physical activity",
    notes: "Recommended physical therapy and proper lifting techniques",
    nextFollowUp: "2025-01-26",
    pharmacyName: "Sports Medicine Pharmacy",
    dispensedDate: "2025-01-12",
    totalAmount: 46.3,
    createdAt: "2025-01-12T14:45:00Z",
    updatedAt: "2025-01-12T14:45:00Z",
  },
  {
    id: "6",
    prescriptionNumber: "RX-2025-006",
    date: "2025-01-08",
    time: "16:20",
    doctor: {
      id: "doc6",
      name: "Dr. Garcia",
      department: "Endocrinology",
      specialization: "Diabetes Management",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "ongoing",
    medications: [
      {
        id: "med9",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "90 days",
        instructions: "Take with meals to reduce stomach upset",
        quantity: 180,
        unitPrice: 0.25,
        totalPrice: 45.0,
      },
      {
        id: "med10",
        name: "Glucose Test Strips",
        dosage: "N/A",
        frequency: "Daily monitoring",
        duration: "30 days",
        instructions: "Test blood glucose levels daily before meals",
        quantity: 100,
        unitPrice: 0.75,
        totalPrice: 75.0,
      },
    ],
    billing: {
      billId: "BILL-2025-006",
      billDate: "2025-01-08",
      consultationFee: 160.0,
      medicationTotal: 120.0,
      pharmacyFee: 8.0,
      subtotal: 288.0,
      tax: 23.04,
      discount: 30.0,
      insuranceCoverage: 200.0,
      finalAmount: 81.04,
      paymentStatus: "pending",
      paymentDate: null,
      paymentMethod: null,
    },
    diagnosis: "Type 2 Diabetes Mellitus",
    notes:
      "Patient education provided for diet management and blood sugar monitoring",
    nextFollowUp: "2025-02-08",
    pharmacyName: "Diabetes Care Pharmacy",
    dispensedDate: "2025-01-08",
    totalAmount: 81.04,
    createdAt: "2025-01-08T16:20:00Z",
    updatedAt: "2025-01-08T16:20:00Z",
  },
  {
    id: "7",
    prescriptionNumber: "RX-2025-007",
    date: "2025-01-03",
    time: "13:15",
    doctor: {
      id: "doc7",
      name: "Dr. Thompson",
      department: "Psychiatry",
      specialization: "Adult Psychiatry",
    },
    patient: {
      id: "PAT-001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      insurance: {
        provider: "HealthCare Plus",
        policyNumber: "HCP-12345",
        groupNumber: "GRP-789",
      },
    },
    status: "completed",
    medications: [
      {
        id: "med11",
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take in the morning with food",
        quantity: 30,
        unitPrice: 1.2,
        totalPrice: 36.0,
      },
    ],
    billing: {
      billId: "BILL-2025-007",
      billDate: "2025-01-03",
      consultationFee: 180.0,
      medicationTotal: 36.0,
      pharmacyFee: 4.5,
      subtotal: 220.5,
      tax: 17.64,
      discount: 0.0,
      insuranceCoverage: 150.0,
      finalAmount: 88.14,
      paymentStatus: "paid",
      paymentDate: "2025-01-03",
      paymentMethod: "Cash",
    },
    diagnosis: "Anxiety disorder",
    notes:
      "Patient responded well to therapy sessions, medication for additional support",
    nextFollowUp: "2025-02-03",
    pharmacyName: "Mental Health Pharmacy",
    dispensedDate: "2025-01-03",
    totalAmount: 88.14,
    createdAt: "2025-01-03T13:15:00Z",
    updatedAt: "2025-01-03T13:15:00Z",
  },
];

  useEffect(() => {
    const completed = mockPrescriptions.filter(p => p.status === "completed");
    setCompletedPrescriptions(completed);
  }, []);

  const filteredPrescriptions = completedPrescriptions.filter(p =>
    p.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medications.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBack = () => navigate('/doctor/doc_10002');

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });

  const formatTime = (timeString) =>
    new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 sticky top-0 z-40 shadow">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleBack}
            className="p-3 rounded-lg hover:bg-blue-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Completed Treatments</h1>
            <p className="text-blue-100 text-sm">
              View all finished prescriptions and care records
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by doctor, diagnosis, or medication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No completed prescriptions found.
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span>{formatDate(p.date)} at {formatTime(p.time)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-2">
                        <Stethoscope size={16} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium">{p.doctor.name}</p>
                          <p className="text-xs text-gray-500">{p.doctor.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{p.diagnosis}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { setSelectedPrescription(p); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && selectedPrescription && (
          <PrescriptionModal
            prescription={selectedPrescription}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CompletedTreatments;
