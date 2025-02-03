import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        // Optionally, you can show a loading spinner here
        return <div className="p-4">Loading...</div>;
    }

    if (!user) {
        console.log('User not logged in, redirecting to login page');
        return <Navigate to="/login" replace />;
    }

    return children;
}