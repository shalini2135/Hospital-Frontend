import { useState } from 'react';
import { HiCog, HiUser, HiShieldCheck } from 'react-icons/hi';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@hospital.com',
    phone: '(555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (showPasswordFields) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match!");
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long!");
        return;
      }
    }
    
    toast.error('Settings saved successfully!');
    setShowPasswordFields(false);
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    // Clear password fields when hiding them
    if (showPasswordFields) {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <HiCog className="w-6 h-6 text-[#2563eb] mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-4">
            <HiUser className="w-5 h-5 text-[#2563eb] mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HiShieldCheck className="w-5 h-5 text-[#2563eb] mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Security</h3>
            </div>
            <button
              type="button"
              onClick={togglePasswordFields}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                showPasswordFields
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#2563eb] text-white hover:bg-blue-700'
              }`}
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          
          {showPasswordFields && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                  minLength="8"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                  minLength="8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>

      
    </div>
  );
};

export default Settings;