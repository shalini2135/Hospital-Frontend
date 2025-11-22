import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiPlus, 
  HiMinus, 
  HiSearch, 
  HiExclamation,
  HiArrowUp,
  HiArrowDown,
  HiOutlineRefresh
} from 'react-icons/hi';
import MedicineService from '../services/MedicineService';
import DeleteConfirmationModal from '../../../components/Admin/DeleteConfirmationModal';

const PharmacyInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
    fetchLowStock();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await MedicineService.getAllMedicines();
      setMedicines(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const data = await MedicineService.checkLowStock(lowStockThreshold);
      setLowStockMedicines(data);
    } catch (err) {
      console.error("Failed to fetch low stock medicines:", err);
    }
  };

  const handleDeleteClick = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!medicineToDelete) return;
    
    try {
      await MedicineService.deleteMedicine(medicineToDelete.id);
      fetchMedicines();
      fetchLowStock();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteModalOpen(false);
      setMedicineToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setMedicineToDelete(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await MedicineService.searchMedicines(searchTerm);
      setMedicines(results);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetSearch = async () => {
    setSearchTerm('');
    await fetchMedicines();
  };

  const sortedMedicines = [...medicines].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-red-50 text-red-600 rounded-lg">
        <p>Error loading medicines: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemType="medicine"
        itemName={medicineToDelete?.name || ''}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Pharmacy Inventory Management</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Link 
            to="/admin/pharmacy/add" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <HiPlus /> Add Medicine
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines by name or batch..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
          {searchTerm && (
            <button 
              type="button"
              onClick={resetSearch}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-4 py-2"
            >
              <HiOutlineRefresh /> Reset
            </button>
          )}
        </form>
        
        {lowStockMedicines.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg flex items-center gap-2">
            <HiExclamation className="text-xl" />
            <span>{lowStockMedicines.length} items below stock threshold ({lowStockThreshold})</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center gap-1">
                  Medicine Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <HiArrowUp /> : <HiArrowDown />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('batch')}
              >
                <div className="flex items-center gap-1">
                  Batch Number
                  {sortConfig.key === 'batch' && (
                    sortConfig.direction === 'asc' ? <HiArrowUp /> : <HiArrowDown />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('stock')}
              >
                <div className="flex items-center gap-1">
                  Stock
                  {sortConfig.key === 'stock' && (
                    sortConfig.direction === 'asc' ? <HiArrowUp /> : <HiArrowDown />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center gap-1">
                  Price
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? <HiArrowUp /> : <HiArrowDown />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('expiry')}
              >
                <div className="flex items-center gap-1">
                  Expiry Date
                  {sortConfig.key === 'expiry' && (
                    sortConfig.direction === 'asc' ? <HiArrowUp /> : <HiArrowDown />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMedicines.length > 0 ? (
              sortedMedicines.map((medicine) => (
                <tr 
                  key={medicine.id} 
                  className={medicine.stock <= lowStockThreshold ? 'bg-red-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {medicine.name}
                        {medicine.stock <= lowStockThreshold && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.batch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${medicine.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(medicine.expiry).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/admin/pharmacy/edit/${medicine.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(medicine)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No medicines found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PharmacyInventory;