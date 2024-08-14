import { useEffect, useState } from 'react';
import axios from 'axios';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/userRole');
        setUserRole(response.data.role); // Assuming the role is returned as `role` in the response
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  return userRole;
};

export default useUserRole;
