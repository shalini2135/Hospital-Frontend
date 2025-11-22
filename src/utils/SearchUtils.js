// utils/searchUtils.js

// Enhanced search function with comprehensive field matching
export const searchPrescriptions = (prescriptions, query, filters) => {
  let filtered = prescriptions;

  // Apply text and date search
  if (query && query.trim() !== "") {
    const searchTerm = query.toLowerCase().trim();

    // Check if query looks like a date (YYYY-MM-DD, MM/DD/YYYY, etc.)
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY or MM/D/YYYY
    ];

    const isDateQuery = dateFormats.some((format) => format.test(searchTerm));

    if (isDateQuery) {
      // Parse different date formats and search by date
      let searchDate;
      try {
        if (searchTerm.includes("/")) {
          const parts = searchTerm.split("/");
          if (parts.length === 3) {
            searchDate = new Date(parts[2], parts[0] - 1, parts[1])
              .toISOString()
              .split("T")[0];
          }
        } else if (searchTerm.includes("-") && searchTerm.length === 10) {
          searchDate = searchTerm; // Already in YYYY-MM-DD format
        }

        if (searchDate) {
          filtered = filtered.filter(
            (prescription) => prescription.date === searchDate
          );
        }
      } catch (error) {
        // If date parsing fails, fall back to text search
        filtered = performTextSearch(filtered, searchTerm);
      }
    } else {
      // Text search across all searchable fields
      filtered = performTextSearch(filtered, searchTerm);
    }
  }

  // Apply advanced filters
  if (filters.selectedDate) {
    filtered = filtered.filter(
      (prescription) => prescription.date === filters.selectedDate
    );
  }

  if (filters.selectedDoctor) {
    filtered = filtered.filter(
      (prescription) => prescription.doctor.id === filters.selectedDoctor
    );
  }

  if (filters.selectedDepartment) {
    filtered = filtered.filter(
      (prescription) =>
        prescription.doctor.department === filters.selectedDepartment
    );
  }

  if (filters.dateRange.start && filters.dateRange.end) {
    filtered = filtered.filter((prescription) => {
      const prescDate = new Date(prescription.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      return prescDate >= startDate && prescDate <= endDate;
    });
  }

  return filtered;
};

// Comprehensive text search function
export const performTextSearch = (prescriptions, searchTerm) => {
  return prescriptions.filter((prescription) => {
    // Search in basic prescription info
    if (
      prescription.prescriptionNumber.toLowerCase().includes(searchTerm) ||
      prescription.date.includes(searchTerm) ||
      prescription.time.includes(searchTerm) ||
      prescription.status.toLowerCase().includes(searchTerm) ||
      prescription.priority.toLowerCase().includes(searchTerm) ||
      prescription.appointmentType.toLowerCase().includes(searchTerm) ||
      prescription.visitReason.toLowerCase().includes(searchTerm) ||
      prescription.officeId.toLowerCase().includes(searchTerm) ||
      prescription.appointmentNumber.includes(searchTerm)
    ) {
      return true;
    }

    // Search in doctor information
    if (
      prescription.doctor.name.toLowerCase().includes(searchTerm) ||
      prescription.doctor.department.toLowerCase().includes(searchTerm) ||
      prescription.doctor.specialization.toLowerCase().includes(searchTerm) ||
      prescription.doctor.mbbs.toLowerCase().includes(searchTerm) ||
      prescription.doctor.regNo.includes(searchTerm) ||
      prescription.doctor.phoneNumber.includes(searchTerm) ||
      prescription.doctor.email.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in patient information
    if (
      prescription.patient.name.toLowerCase().includes(searchTerm) ||
      prescription.patient.id.toLowerCase().includes(searchTerm) ||
      prescription.patient.email.toLowerCase().includes(searchTerm) ||
      prescription.patient.phone.includes(searchTerm) ||
      prescription.patient.gender.toLowerCase().includes(searchTerm) ||
      prescription.patient.bloodGroup.toLowerCase().includes(searchTerm) ||
      prescription.patient.dateOfBirth.includes(searchTerm) ||
      prescription.patient.address.street.toLowerCase().includes(searchTerm) ||
      prescription.patient.address.city.toLowerCase().includes(searchTerm) ||
      prescription.patient.address.state.toLowerCase().includes(searchTerm) ||
      prescription.patient.address.zipCode.includes(searchTerm)
    ) {
      return true;
    }

    // Search in patient insurance
    if (
      prescription.patient.insurance.provider
        .toLowerCase()
        .includes(searchTerm) ||
      prescription.patient.insurance.policyNumber
        .toLowerCase()
        .includes(searchTerm) ||
      prescription.patient.insurance.groupNumber
        .toLowerCase()
        .includes(searchTerm)
    ) {
      return true;
    }

    // Search in medical history and allergies
    if (
      prescription.patient.medicalHistory.some((history) =>
        history.toLowerCase().includes(searchTerm)
      ) ||
      prescription.patient.allergies.some((allergy) =>
        allergy.toLowerCase().includes(searchTerm)
      )
    ) {
      return true;
    }

    // Search in medical details
    if (
      prescription.diagnosis.toLowerCase().includes(searchTerm) ||
      prescription.icdCodes.some((code) =>
        code.toLowerCase().includes(searchTerm)
      ) ||
      prescription.clinicalNotes?.toLowerCase().includes(searchTerm) ||
      prescription.treatmentPlan?.toLowerCase().includes(searchTerm) ||
      prescription.notes?.toLowerCase().includes(searchTerm) ||
      prescription.referredBy.toLowerCase().includes(searchTerm) ||
      prescription.followUpInstructions?.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in vital signs
    if (
      prescription.vitalSigns.bloodPressure
        .toLowerCase()
        .includes(searchTerm) ||
      prescription.vitalSigns.heartRate.toLowerCase().includes(searchTerm) ||
      prescription.vitalSigns.temperature.toLowerCase().includes(searchTerm) ||
      prescription.vitalSigns.weight.toLowerCase().includes(searchTerm) ||
      prescription.vitalSigns.height.toLowerCase().includes(searchTerm) ||
      prescription.vitalSigns.oxygenSaturation
        .toLowerCase()
        .includes(searchTerm)
    ) {
      return true;
    }

    // Search in lab results
    if (
      prescription.labResults.some(
        (result) =>
          result.test.toLowerCase().includes(searchTerm) ||
          result.value.toLowerCase().includes(searchTerm) ||
          result.status.toLowerCase().includes(searchTerm)
      )
    ) {
      return true;
    }

    // Search in medications
    if (
      prescription.medications.some(
        (medication) =>
          medication.name.toLowerCase().includes(searchTerm) ||
          medication.genericName.toLowerCase().includes(searchTerm) ||
          medication.dosage.toLowerCase().includes(searchTerm) ||
          medication.frequency.toLowerCase().includes(searchTerm) ||
          medication.instructions.toLowerCase().includes(searchTerm) ||
          medication.manufacturer.toLowerCase().includes(searchTerm) ||
          medication.lotNumber.toLowerCase().includes(searchTerm)
      )
    ) {
      return true;
    }

    // Search in pharmacy information
    if (
      prescription.pharmacyName?.toLowerCase().includes(searchTerm) ||
      prescription.pharmacyAddress?.toLowerCase().includes(searchTerm) ||
      prescription.pharmacyPhone?.includes(searchTerm) ||
      prescription.dispensedBy?.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in billing information
    if (
      prescription.billing?.billId.toLowerCase().includes(searchTerm) ||
      prescription.billing?.paymentStatus.toLowerCase().includes(searchTerm) ||
      prescription.billing?.paymentMethod?.toLowerCase().includes(searchTerm) ||
      prescription.billing?.transactionId?.toLowerCase().includes(searchTerm)
    ) {
      return true;
    }

    // Search in hospital information
    if (
      prescription.hospitalName.toLowerCase().includes(searchTerm) ||
      prescription.hospitalAddress.toLowerCase().includes(searchTerm) ||
      prescription.hospitalPhone.includes(searchTerm)
    ) {
      return true;
    }

    return false;
  });
};