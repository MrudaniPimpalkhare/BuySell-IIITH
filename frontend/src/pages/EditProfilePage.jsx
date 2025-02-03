import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditProfilePage() {
    const [user, setUser] = useState({
        firstname: '',
        surname: '',
        age: '',
        contact: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get('http://localhost:4000/profile', { withCredentials: true });
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            navigate('/login');
            alert('Failed to load profile');
        }
    };

    const handleUserChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        // Validate user fields
        if (!user.firstname.trim()) newErrors.firstname = 'First name is required.';
        if (!user.surname.trim()) newErrors.surname = 'Last name is required.';
        if (!user.age || isNaN(user.age) || user.age <= 0) newErrors.age = 'Age must be a number greater than 0.';
        if (!user.contact) newErrors.contact = 'Contact number is required.';
        // Optionally, add regex for contact number validation

        // Validate password fields if any password field is filled
        if (
            passwordData.currentPassword ||
            passwordData.newPassword ||
            passwordData.confirmNewPassword
        ) {
            if (!passwordData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to change password.';
            }
            if (!passwordData.newPassword) {
                newErrors.newPassword = 'New password is required.';
            }
            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                newErrors.confirmNewPassword = 'New passwords do not match.';
            }
            // Optionally, enforce password strength
            if (passwordData.newPassword.length < 6) {
                newErrors.newPassword = 'New password must be at least 6 characters long.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = { ...user };

        // If changing password, include password fields
        if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmNewPassword) {
            payload.currentPassword = passwordData.currentPassword;
            payload.newPassword = passwordData.newPassword;
        }else{
            console.log("No password change");
        }

        try {
            console.log('Updating profile:', payload);
            const response = await axios.post('http://localhost:4000/profile', payload, { withCredentials: true });
            alert('Profile updated successfully');
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Failed to update profile: ${error.response.data.error}`);
            } else {
                alert('Failed to update profile');
            }
        }
    };

    return (
        <div className="mt-4 grow flex items-center justify-center bg-blue-100">
            <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-2xl">
                <h1 className="text-4xl text-center text-blue-400 mb-4">Edit Profile</h1>
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={user.firstname}
                            onChange={handleUserChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.firstname ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            name="surname"
                            placeholder="Last Name"
                            value={user.surname}
                            onChange={handleUserChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.surname ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
                    </div>

                    {/* Age */}
                    <div className="mb-4">
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={user.age}
                            onChange={handleUserChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.age ? 'border-red-500' : ''}`}
                            required
                            min="1"
                        />
                        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                    </div>

                    {/* Contact Number */}
                    <div className="mb-4">
                        <input
                            type="text"
                            name="contact"
                            placeholder="Contact Number"
                            value={user.contact}
                            onChange={handleUserChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.contact ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
                    </div>

                    {/* Password Fields */}
                    <hr className="mb-4" />
                    <h2 className="text-2xl mb-4 text-gray-700">Change Password</h2>

                    {/* Current Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.currentPassword ? 'border-red-500' : ''}`}
                        />
                        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.newPassword ? 'border-red-500' : ''}`}
                        />
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                    </div>

                    {/* Confirm New Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            className={`mb-2 p-2 border rounded w-full ${errors.confirmNewPassword ? 'border-red-500' : ''}`}
                        />
                        {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-400 text-white rounded-2xl hover:bg-blue-200 transition-all duration-300"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}