import { useState, useEffect, useRef } from 'react';

const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  fields = [], 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
      setErrors({});
      // Reset file inputs when modal opens
      Object.keys(fileInputRefs.current).forEach(key => {
        if (fileInputRefs.current[key]) {
          fileInputRefs.current[key].value = '';
        }
      });
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    if (type === 'file') {
      // Create a preview URL for the image
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: file ? URL.createObjectURL(file) : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return field.title || 'Invalid format';
      }
    }

    if (field.validate && typeof field.validate === 'function') {
      const validationResult = field.validate(value, formData);
      if (validationResult !== true) {
        return field.errorMessage || validationResult;
      }
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div 
                  key={field.name} 
                  className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.icon && field.icon}
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'file' ? (
                    <div className="space-y-2">
                      {(formData[`${field.name}Preview`] || field.currentValue) && (
                        <div className="flex items-center space-x-4">
                          <img 
                            src={formData[`${field.name}Preview`] || field.currentValue} 
                            alt="Preview" 
                            className="h-16 w-16 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-500">
                            {formData[field.name]?.name || 'Current photo'}
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id={field.name}
                        name={field.name}
                        ref={el => fileInputRefs.current[field.name] = el}
                        onChange={handleChange}
                        accept={field.accept || "image/*"}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || field.defaultValue || ''}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base`}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {(field.options || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base`}
                      required={field.required}
                      rows={4}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base`}
                      required={field.required}
                      placeholder={field.placeholder}
                      pattern={field.pattern}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
              >
                {title.startsWith('Edit') ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormModal;