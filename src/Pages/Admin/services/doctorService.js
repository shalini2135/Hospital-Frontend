import imageCompression from 'browser-image-compression';

const API_BASE_URL = 'https://doctorpanel-backend.onrender.com/api/doctor';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error Details:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to compress images
const compressImage = async (file, maxSizeMB = 0.8, maxWidthOrHeight = 800) => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: 0.8
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error);
    throw error;
  }
};

export const createDoctor = async (doctorData, profilePhoto) => {
  try {
    // Prepare doctor data with proper structure
    const doctorPayload = {
      doctorName: doctorData.doctorName,
      email: doctorData.email,
      password: doctorData.password,
      phone: doctorData.phone,
      specialty: doctorData.specialty,
      nmrId: doctorData.nmrId,
      bio: doctorData.bio || '',
      education: doctorData.education || '',
      experience: doctorData.experience || '',
      status: doctorData.status || 'Active',
      departmentId: doctorData.departmentId || 'DEP-00001',
      // Convert comma-separated languages to string (backend will split it)
      languages: doctorData.languages || ''
    };

    console.log('Creating doctor with payload:', doctorPayload);

    // If there's a photo, use FormData for multipart upload
    if (profilePhoto instanceof File) {
      const formData = new FormData();
      
      // Compress image
      const compressedPhoto = await compressImage(profilePhoto);
      
      // Append doctor data as JSON string
      formData.append('doctor', JSON.stringify(doctorPayload));
      formData.append('photo', compressedPhoto);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
      });

      return handleResponse(response);
    } else {
      // No photo - use JSON endpoint
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorPayload),
      });

      return handleResponse(response);
    }
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (id, doctorData, profilePhoto) => {
  try {
    // Prepare the update payload - backend expects all fields
    const payload = {
      doctorName: doctorData.doctorName,
      email: doctorData.email,
      phone: doctorData.phone,
      specialty: doctorData.specialty,
      nmrId: doctorData.nmrId,
      bio: doctorData.bio || '',
      education: doctorData.education || '',
      experience: doctorData.experience || '',
      status: doctorData.status || 'Active',
      departmentId: doctorData.departmentId || 'DEP-00001',
      // Keep existing password if not provided
      password: doctorData.password || '',
      // Convert comma-separated languages to string
      languages: doctorData.languages || '',
      // Keep existing photoUrl if no new photo
      photoUrl: doctorData.photoUrl || ''
    };

    console.log('Updating doctor with payload:', payload);

    // For updates, we'll use JSON API (photo upload in update needs separate handling)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating doctor ${id}:`, error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    // DELETE returns 204 No Content on success
    if (response.status === 204) {
      return { success: true };
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting doctor ${id}:`, error);
    throw error;
  }
};

export const getDoctorsBySpecialty = async (specialty) => {
  try {
    const response = await fetch(`${API_BASE_URL}/by-specialty?specialty=${encodeURIComponent(specialty)}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching doctors by specialty ${specialty}:`, error);
    throw error;
  }
};