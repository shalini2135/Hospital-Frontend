const API_BASE_URL = 'https://pharmacy-backend-r88x.onrender.com/api/medicines';

const MedicineService = {
  getAllMedicines: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch medicines');
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to fetch medicines';
    }
  },

  getMedicineById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Medicine not found');
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to fetch medicine';
    }
  },

  addMedicine: async (medicineData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData)
      });
      if (!response.ok) throw new Error('Failed to add medicine');
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to add medicine';
    }
  },

  updateMedicine: async (id, medicineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicineData)
      });
      if (!response.ok) throw new Error('Failed to update medicine');
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to update medicine';
    }
  },

  deleteMedicine: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete medicine');
      return true;
    } catch (error) {
      throw error.message || 'Failed to delete medicine';
    }
  },

  searchMedicines: async (searchTerm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search?term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Failed to search medicines');
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to search medicines';
    }
  },

  checkLowStock: async (threshold = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/low-stock?threshold=${threshold}`);
      if (!response.ok) throw new Error('Failed to check low stock');
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to check low stock';
    }
  }
};

export default MedicineService;