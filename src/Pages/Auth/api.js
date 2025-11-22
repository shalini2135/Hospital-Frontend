// API Configuration
export const API_BASE_URL = 'https://authentication-n090.onrender.com/api/auth';

// Utility Functions
const parseJwt = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (e) {
    console.error('JWT parsing error:', e);
    return null;
  }
};

const determineRole = (userId, decodedToken = null) => {
  // First try to get role from JWT if available
  if (decodedToken?.roles?.length > 0) {
    return decodedToken.roles[0];
  }
  
  // Fallback to user ID prefix matching
  // if (!userId) return 'ROLE_PATIENT';
  
  const prefix = (userId.split('-')[0] || '').toUpperCase();
  console.log(prefix)
  
  switch (prefix) {
    case 'DOC': return 'ROLE_DOCTOR';
    case 'ADM': return 'ROLE_ADMIN';
    case 'REC': return 'ROLE_NURSE';
    case 'PAT': return 'ROLE_PATIENT';
  }
};

// Storage Functions
const storeUserData = (user) => {
  try {
    if (user && typeof user === 'object') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      console.error('Invalid user data for storage');
      localStorage.removeItem('currentUser');
    }
  } catch (e) {
    console.error('LocalStorage access error:', e);
  }
};

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return null;
  }
};

const clearUserData = () => {
  localStorage.removeItem('currentUser');
};

// Authentication Functions
export const getAuthToken = () => {
  const user = getCurrentUser();
  return user?.token || null;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  const decoded = parseJwt(token);
  if (!decoded) return false;
  
  // Check if token is expired (with 5 second buffer)
  return (decoded.exp * 1000) > (Date.now() + 5000);
};

// API Functions
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Password reset request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (userId, token, newPassword) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reset-password`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token, newPassword }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Password reset failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const role = determineRole(userData.userId);
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      enabled: true,
      roles: [role],
      userid: userData.userId
    };

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    const decoded = parseJwt(data.token);
    const role = determineRole(data.userid, decoded);
     console.log(data,"weoooo")
    const user = {
      token: data.token,
      email: email,
      role: role,
      username: data.username,
      userId: data.userid
    };

    storeUserData(user);
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = () => {
  clearUserData();
};

export const registerPatientDetails = async (patientData) => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(`${API_BASE_URL}/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Patient registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Patient registration error:', error);
    throw error;
  }
};

// Role Check Functions
export const isAdmin = () => getCurrentUser()?.role === 'ROLE_ADMIN';
export const isDoctor = () => getCurrentUser()?.role === 'ROLE_DOCTOR';
export const isNurse = () => getCurrentUser()?.role === 'ROLE_NURSE';
export const isPatient = () => getCurrentUser()?.role === 'ROLE_PATIENT';

// Authenticated Fetch
export const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        clearUserData();
        window.location.href = '/login';
        return;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
};