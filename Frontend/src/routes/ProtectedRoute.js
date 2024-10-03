import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, roles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/userRole', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (userRole !== roles) {
    localStorage.removeItem('token');
  }

  return userRole === roles ? <Component /> : <Navigate to="/login" />;
};


export default ProtectedRoute;
