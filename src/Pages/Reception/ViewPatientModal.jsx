import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, Heart, Download, Edit } from 'lucide-react';

const ViewPatientModal = ({ 
  isOpen, 
  onClose, 
  patient, 
  onEdit, 
  onGeneratePDF 
}) => {
  if (!isOpen || !patient) return null;

  // Professional Hospital-grade PDF generation
  const generatePatientPDF = async () => {
    try {
      let jsPDF;
      if (typeof window !== 'undefined' && window.jsPDF) {
        jsPDF = window.jsPDF;
      } else {
        try {
          const jsPDFModule = await import('jspdf');
          jsPDF = jsPDFModule.default || jsPDFModule;
        } catch (importError) {
          console.error('jsPDF not available:', importError);
          toast.error('PDF generation library not available. Please ensure jsPDF is loaded.');
          return false;
        }
      }
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let yPos = margin;

      // Hospital Header - Professional Blue Header
      doc.setFillColor(25, 55, 109); // Professional navy blue
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Hospital Logo area (left side)
      doc.setFillColor(255, 255, 255);
      doc.circle(15, 17.5, 8, 'F');
      doc.setTextColor(25, 55, 109);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('H+', 15, 19, { align: 'center' });

      // Hospital Name and Address (centered)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDITRACK GENERAL HOSPITAL', pageWidth / 2, 12, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('123 Healthcare Avenue, Medical District, Coimbatore - 641001', pageWidth / 2, 18, { align: 'center' });
      doc.text('Tel: +91-422-123-4567 | Emergency: +91-422-100-2000 | www.meditrack.com', pageWidth / 2, 23, { align: 'center' });
      
      // Date and Time (right aligned)
      const currentDate = new Date();
      const dateStr = currentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const timeStr = currentDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      doc.setFontSize(8);
      doc.text(`Generated: ${dateStr} ${timeStr}`, pageWidth - 5, 30, { align: 'right' });

      // Document Title Bar
      yPos = 45;
      doc.setFillColor(240, 243, 248);
      doc.setDrawColor(25, 55, 109);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, contentWidth, 12, 'FD');
      
      doc.setTextColor(25, 55, 109);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT MEDICAL RECORD', margin + 5, yPos + 8);
      
      // Medical Record Number (right aligned)
      doc.setFontSize(10);
      doc.text(`MRN: ${patient.id}`, pageWidth - margin - 5, yPos + 8, { align: 'right' });

      yPos += 20;

      // Patient Information Section
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.rect(margin, yPos, contentWidth, 45, 'D');
      
      // Section Header
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT DEMOGRAPHICS', margin + 3, yPos + 5.5);

      // Patient details in structured format
      yPos += 12;
      const leftCol = margin + 5;
      const rightCol = margin + (contentWidth / 2) + 5;

      // Left Column
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT NAME:', leftCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(patient.name.toUpperCase(), leftCol + 25, yPos);

      yPos += 6;
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('AGE / GENDER:', leftCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`${patient.age} Years / ${patient.gender}`, leftCol + 25, yPos);

      yPos += 6;
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('BLOOD GROUP:', leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(11);
      doc.text(patient.bloodGroup, leftCol + 25, yPos);

      // Right Column
      yPos -= 12;
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTACT NUMBER:', rightCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(patient.contactNumber || 'Not Available', rightCol + 30, yPos);

      yPos += 6;
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('EMAIL ADDRESS:', rightCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const emailText = patient.patientEmail || 'Not Available';
      doc.text(emailText.length > 35 ? emailText.substring(0, 35) + '...' : emailText, rightCol + 30, yPos);

      yPos += 6;
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('MARITAL STATUS:', rightCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(patient.maritalStatus || 'Not Specified', rightCol + 30, yPos);

      yPos += 15;

      // Address Section
      doc.setDrawColor(180, 180, 180);
      doc.rect(margin, yPos, contentWidth, 20, 'D');
      
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('RESIDENTIAL ADDRESS', margin + 3, yPos + 5.5);

      yPos += 12;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const fullAddress = `${patient.rawAddress || 'N/A'}, ${patient.city || 'N/A'}, ${patient.state || 'N/A'} - ${patient.zipCode || 'N/A'}`;
      
      // Word wrap for address
      const addressLines = doc.splitTextToSize(fullAddress, contentWidth - 10);
      addressLines.forEach((line, index) => {
        doc.text(line, margin + 5, yPos + (index * 4));
      });

      yPos += Math.max(8, addressLines.length * 4) + 10;

      // Emergency Contacts Section
      if (patient.emergencyContacts && patient.emergencyContacts.length > 0) {
        const emergencyHeight = Math.max(25, patient.emergencyContacts.length * 15 + 15);
        
        doc.setDrawColor(180, 180, 180);
        doc.rect(margin, yPos, contentWidth, emergencyHeight, 'D');
        
        doc.setFillColor(254, 242, 242);
        doc.rect(margin, yPos, contentWidth, 8, 'F');
        doc.setTextColor(150, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('EMERGENCY CONTACTS', margin + 3, yPos + 5.5);

        yPos += 12;
        
        patient.emergencyContacts.forEach((contact, index) => {
          const contactY = yPos + (index * 15);
          
          // Contact number
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`CONTACT ${index + 1}:`, margin + 5, contactY);
          
          // Name and relation
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const nameText = contact.name ? `${contact.name}${contact.relation ? ` (${contact.relation})` : ''}` : 'Name not provided';
          doc.text(nameText, margin + 25, contactY);
          
          // Phone and email
          const phoneText = contact.phone ? `Ph: ${contact.phone}` : '';
          const emailText = contact.email ? `Email: ${contact.email}` : '';
          const contactInfo = [phoneText, emailText].filter(Boolean).join(' | ');
          
          if (contactInfo) {
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(contactInfo, margin + 25, contactY + 4);
          }
        });

        yPos += emergencyHeight + 5;
      }

      // Medical History Section
      doc.setDrawColor(180, 180, 180);
      doc.rect(margin, yPos, contentWidth, 30, 'D');
      
      doc.setFillColor(245, 250, 255);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setTextColor(0, 50, 100);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDICAL HISTORY & VISITS', margin + 3, yPos + 5.5);

      yPos += 15;
      const medicalLeftCol = margin + 5;
      const medicalRightCol = margin + (contentWidth / 2) + 5;

      // Registration Date
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('REGISTRATION DATE:', medicalLeftCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(patient.registrationDate || 'Not Available', medicalLeftCol + 35, yPos);

      // Last Visit
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('LAST VISIT DATE:', medicalRightCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(patient.lastVisit || 'Not Available', medicalRightCol + 30, yPos);

      yPos += 8;
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT STATUS:', medicalLeftCol, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 150, 0);
      doc.setFontSize(10);
      doc.text('ACTIVE', medicalLeftCol + 35, yPos);

      yPos += 20;

      // Important Notes Section
      doc.setFillColor(255, 248, 225);
      doc.setDrawColor(255, 193, 7);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, contentWidth, 25, 'FD');
      
      doc.setTextColor(130, 100, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('IMPORTANT MEDICAL NOTES:', margin + 5, yPos + 8);
      
      doc.setTextColor(100, 80, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('• Please verify patient identity before providing any medical service', margin + 8, yPos + 14);
      doc.text('• Contact emergency contacts in case of medical emergency', margin + 8, yPos + 18);
      doc.text('• This record is confidential and protected under medical privacy laws', margin + 8, yPos + 22);

      yPos += 35;

      // Professional Footer
      doc.setDrawColor(25, 55, 109);
      doc.setLineWidth(1);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      
      yPos += 8;
      
      // Footer content
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // Left side - Hospital info
      doc.text('MediTrack General Hospital | Department of Medical Records', margin, yPos);
      doc.text('Accredited by National Accreditation Board for Hospitals (NABH)', margin, yPos + 4);
      
      // Right side - Legal notice
      doc.text('CONFIDENTIAL MEDICAL RECORD', pageWidth - margin, yPos, { align: 'right' });
      doc.text('Unauthorized access or disclosure is prohibited by law', pageWidth - margin, yPos + 4, { align: 'right' });
      
      // Center - Page info
      doc.setFont('helvetica', 'bold');
      doc.text('Page 1 of 1', pageWidth / 2, yPos + 8, { align: 'center' });
      
      // Signature area
      yPos += 15;
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, margin + 60, yPos);
      doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Medical Officer Signature', margin, yPos + 4);
      doc.text('Date & Official Seal', pageWidth - margin, yPos + 4, { align: 'right' });

      // Generate filename with timestamp
      const timestamp = currentDate.toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `MediTrack_MedicalRecord_${patient.name.replace(/\s+/g, '_')}_${patient.id}_${timestamp}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  };

  const handleGeneratePDF = async () => {
    const success = await generatePatientPDF();
    if (success && onGeneratePDF) {
      onGeneratePDF(patient);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">Patient Medical Record</h2>
              <p className="text-blue-100 text-sm">Electronic Health Record System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Patient Header Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-gray-600">Patient ID: {patient.id}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500">Age</p>
                <p className="text-lg font-semibold text-gray-900">{patient.age} years</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-lg font-semibold text-gray-900">{patient.gender}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="text-lg font-semibold text-red-600">{patient.bloodGroup}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="text-lg font-semibold text-gray-900">{patient.maritalStatus || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics & Contact */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Patient Contact Information
                </h4>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Patient Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{patient.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Patient Email</p>
                      <p className="text-sm font-semibold text-gray-900">{patient.patientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Home Address</p>
                      <p className="text-sm font-semibold text-gray-900">{patient.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  Emergency Contacts
                </h4>
              </div>
              <div className="p-4 space-y-3">
                {patient.emergencyContacts && patient.emergencyContacts.length > 0 ? (
                  patient.emergencyContacts.map((contact, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4">
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Contact {index + 1}</p>
                        {contact.name && (
                          <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                        )}
                        {contact.relation && (
                          <p className="text-xs text-gray-500">({contact.relation})</p>
                        )}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-900">{contact.phone}</p>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-900">{contact.email}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No emergency contacts available</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical History & Dates */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                Medical History
              </h4>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Registration Date</p>
                    <p className="text-sm font-semibold text-gray-900">{patient.registrationDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Last Visit</p>
                    <p className="text-sm font-semibold text-gray-900">{patient.lastVisit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Blood Group</p>
                    <p className="text-sm font-semibold text-red-600">{patient.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={handleGeneratePDF}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button 
              onClick={() => {
                onClose();
                onEdit(patient);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Patient
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;