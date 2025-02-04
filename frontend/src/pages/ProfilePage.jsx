import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function ProfilePage() {
    const [user, setUser] = useState({
        firstname: '',
        surname: '',
        email: '',
        age: '',
        contact: '',
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get('/profile', { withCredentials: true });
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            navigate('/login');
            alert('Failed to load profile');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                    </svg>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.firstname} {user.surname}
                        </h2>
                        <p className="text-gray-500">@{user.firstname.toLowerCase()}</p>

                    </div>
                </div>

                {/* About Section */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">About</h3>
                    <p className="text-gray-600 mt-2">
                        
                    </p>
                </div>

                {/* Contact Info */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                    <p className="text-gray-600 mt-2">
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-gray-600">
                        <strong>Age:</strong> {user.age}
                    </p>
                    <p className="text-gray-600">
                        <strong>Contact:</strong> {user.contact}
                    </p>
                </div>

                {/* Show ratings */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Ratings</h3>
                    <p className="text-gray-600 mt-2">
                        <strong>Rating:</strong> {user.averageRating}
                    </p>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-6 text-center">
                    <Link to="/editprofile">
                        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300">
                            Edit Profile
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}