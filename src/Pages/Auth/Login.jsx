import React, { useState } from 'react';
import { loginUser, requestPasswordReset, resetPassword } from './api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose, onSignupClick, onLoginSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        setIsLoading(true);

        try {
            const user = await loginUser(formData.email, formData.password);
            
            setSuccessMessage('Login successful!');
            
            // Determine where to redirect based on role
            let redirectPath = '/';
            switch (user.role) {
                case 'admin':
                    redirectPath = '/admin/dashboard';
                    break;
                case 'doctor':
                    redirectPath = '/doctor/profile';
                    break;
                case 'nurse':
                    redirectPath = '/nurse/profile';
                    break;
                case 'patient':
                    redirectPath = '/patient/profile';
                    break;
                default:
                    redirectPath = '/';
            }

            if (onLoginSuccess) {
                onLoginSuccess();
                console.log(localStorage.getItem('currentUser'));
            }

            setTimeout(() => {
                onClose();
                window.location.reload(); 
            }, 1000);
            
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!forgotPasswordEmail) {
            setError('Email is required');
            return;
        }

        setIsLoading(true);

        try {
            const response = await requestPasswordReset(forgotPasswordEmail);
            setUserId(response.userId);
            setForgotPasswordSuccess('Please enter your new password');
        } catch (error) {
            setError(error.message || 'Failed to verify email. Please check your email address.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(userId, newPassword);
            setForgotPasswordSuccess('Password reset successfully. You can now login with your new password.');
            setTimeout(() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail('');
                setNewPassword('');
                setConfirmPassword('');
                setUserId(null);
            }, 2000);
        } catch (error) {
            setError(error.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-blue-600 transition-colors"
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    margin: '0',
                }}
            >
                ×
            </button>

            {!showForgotPassword ? (
                <>
                    <h2 className="text-2xl font-bold text-center text-black mb-2">Welcome Back!</h2>
                    <p className="text-black text-center mb-6">Login with your details to continue</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                            {successMessage}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm text-black mb-1">Email:</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-black mb-1">Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-blue-600 hover:underline focus:outline-none"
                        >
                            Forgot Password?
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-black">
                        Don't have an account?{' '}
                        <button
                            onClick={onSignupClick}
                            className="text-sm text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        >
                            SignUp
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-center text-black mb-2">Reset Password</h2>
                    <p className="text-black text-center mb-6">Enter your email to reset your password</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {forgotPasswordSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                            {forgotPasswordSuccess}
                        </div>
                    )}

                    {!userId ? (
                        <form className="space-y-5" onSubmit={handleForgotPassword}>
                            <div>
                                <label className="block text-sm text-black mb-1">Email:</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError('');
                                        setForgotPasswordEmail('');
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Back to Login
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Email'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-5" onSubmit={handleResetPassword}>
                            <div>
                                <label className="block text-sm text-black mb-1">New Password:</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-black mb-1">Confirm Password:</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-blue-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError('');
                                        setForgotPasswordEmail('');
                                        setUserId(null);
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default Login;