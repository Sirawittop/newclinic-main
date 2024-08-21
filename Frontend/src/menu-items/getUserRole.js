import axios from 'axios';

const getUserRole = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/userRole', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.role;
  } catch (error) {
    console.error('Failed to fetch user role:', error);
  }
};
