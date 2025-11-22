import React, { useState } from 'react';
import { X, Calendar, Clock, User, Stethoscope, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

const ScheduleAppointmentModal = ({
  isOpen,
  onClose,
  onSchedule,
  patientName
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    provider: '',
    department: '',
    type: '',
    notes: '',
    priority: 'normal'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const providers = [
    { name: 'Dr. Johnson', department: 'Endocrinology', specialties: ['Diabetes', 'Thyroid', 'Hormonal Disorders'] },
    { name: 'Dr. Wilson', department: 'Primary Care', specialties: ['General Medicine', 'Preventive Care', 'Health Screenings'] },
    { name: 'Dr. Smith', department: 'Cardiology', specialties: ['Heart Disease', 'Blood Pressure', 'Cardiovascular Health'] },
    { name: 'Dr. Brown', department: 'Dermatology', specialties: ['Skin Conditions', 'Allergies', 'Cosmetic Procedures'] },
    { name: 'Dr. Davis', department: 'Orthopedics', specialties: ['Bone Health', 'Joint Pain', 'Sports Medicine'] }
  ];

  const appointmentTypes = [
    'Annual Physical',
    'Follow-up Visit',
    'Consultation',
    'Routine Check-up',
    'Specialist Referral',
    'Lab Results Review',
    'Preventive Care',
    'Emergency Consultation'
  ];

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProviderSelect = (provider) => {
    setFormData(prev => ({
      ...prev,
      provider: provider.name,
      department: provider.department
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAppointment = {
      id: Date.now(),
      date: new Date(formData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: formData.time,
      provider: formData.provider,
      department: formData.department,
      type: formData.type,
      status: 'Scheduled',
      notes: formData.notes,
      priority: formData.priority
    };

    onSchedule(newAppointment);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      date: '',
      time: '',
      provider: '',
      department: '',
      type: '',
      notes: '',
      priority: 'normal'
    });
    setCurrentStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.type && formData.priority;
      case 2:
        return formData.provider && formData.department;
      case 3:
        return formData.date && formData.time;
      default:
        return true;
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getPriorityStyle = (priority, isSelected) => {
    const baseStyle = "p-3 text-center border-2 rounded-xl transition-all duration-200";
    if (isSelected) {
      switch (priority) {
        case 'low':
          return `${baseStyle} border-blue-500 bg-blue-50 text-blue-700`;
        case 'normal':
          return `${baseStyle} border-green-500 bg-green-50 text-green-700`;
        case 'urgent':
          return `${baseStyle} border-red-500 bg-red-50 text-red-700`;
        default:
          return `${baseStyle} border-gray-200`;
      }
    }
    return `${baseStyle} border-gray-200 hover:border-gray-300`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 md:p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Schedule New Appointment</h2>
              <p className="text-green-100 text-sm md:text-base">For {patientName}</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 md:mt-6">
            <div className="grid grid-cols-4 gap-1 text-xs md:text-sm font-medium mb-2">
              <span className={currentStep >= 1 ? 'text-white' : 'text-green-200'}>Appointment Type</span>
              <span className={currentStep >= 2 ? 'text-white' : 'text-green-200'}>Select Provider</span>
              <span className={currentStep >= 3 ? 'text-white' : 'text-green-200'}>Date & Time</span>
              <span className={currentStep >= 4 ? 'text-white' : 'text-green-200'}>Confirmation</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-8 md:py-12">
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Appointment Scheduled!</h3>
              <p className="text-muted-foreground">Your appointment has been successfully scheduled.</p>
            </div>
          ) : (
            <>
              {/* Step 1: Appointment Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">What type of appointment do you need?</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Appointment Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {appointmentTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleInputChange('type', type)}
                          className={`p-3 md:p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                            formData.type === type
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-border hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-sm md:text-base">{type}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Priority Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'low', label: 'Low' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'urgent', label: 'Urgent' }
                      ].map((priority) => (
                        <button
                          key={priority.value}
                          onClick={() => handleInputChange('priority', priority.value)}
                          className={getPriorityStyle(priority.value, formData.priority === priority.value)}
                        >
                          <span className="text-sm md:text-base">{priority.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Provider Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Select a Healthcare Provider</h3>
                  
                  <div className="space-y-4">
                    {providers.map((provider) => (
                      <button
                        key={provider.name}
                        onClick={() => handleProviderSelect(provider)}
                        className={`w-full p-3 md:p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                          formData.provider === provider.name
                            ? 'border-green-500 bg-green-50'
                            : 'border-border hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm md:text-base">{provider.name}</h4>
                            <p className="text-xs md:text-sm text-muted-foreground mb-2">{provider.department}</p>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {provider.specialties.map((specialty) => (
                                <span
                                  key={specialty}
                                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date and Time */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Select Date and Time</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Preferred Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        min={getMinDate()}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full p-3 md:p-4 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Preferred Time</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleInputChange('time', time)}
                            className={`p-2 md:p-3 text-xs md:text-sm border rounded-lg transition-all duration-200 ${
                              formData.time === time
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-border hover:border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Additional Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any specific concerns or information you'd like to share..."
                      className="w-full p-3 md:p-4 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring h-20 md:h-24 resize-none bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Confirm Your Appointment</h3>
                  
                  <div className="bg-muted p-4 md:p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-sm md:text-base">Patient:</span>
                      <span className="text-sm md:text-base">{patientName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-sm md:text-base">Provider:</span>
                      <span className="text-sm md:text-base">{formData.provider} - {formData.department}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-sm md:text-base">Date:</span>
                      <span className="text-sm md:text-base">{new Date(formData.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-sm md:text-base">Time:</span>
                      <span className="text-sm md:text-base">{formData.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm md:text-base">Type:</span>
                      <span className="text-sm md:text-base">{formData.type}</span>
                    </div>
                    {formData.notes && (
                      <div className="flex items-start gap-3">
                        <span className="font-medium text-sm md:text-base flex-shrink-0">Notes:</span>
                        <span className="text-muted-foreground text-sm md:text-base">{formData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="border-t border-border bg-muted/50 p-4 md:p-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <button
                onClick={() => currentStep === 1 ? handleClose() : setCurrentStep(Math.max(1, currentStep - 1))}
                className="px-4 md:px-6 py-2 md:py-3 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm md:text-base order-2 sm:order-1"
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid()}
                  className="px-6 md:px-8 py-2 md:py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm md:text-base order-1 sm:order-2"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 md:px-8 py-2 md:py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Appointment'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleAppointmentModal;