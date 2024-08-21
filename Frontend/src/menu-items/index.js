import axios from 'axios';
import utilities from './utilities';
import dashboarduser from './dashboarduser';

// Function to get user role from backend
const getUserRole = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/userRole', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.role;
  } catch (error) {
    console.error('Failed to fetch user role:', error);
    return null; // Return null or some default value in case of error
  }
};

// Function to get menu items based on user role
const getMenuItems = async () => {
  const role = await getUserRole();
  let items = [];

  if (role === 1) {
    items.push(utilities);
  } else if (role === 2) {
    items.push(dashboarduser);
  }

  return { items };
};

const menuItems = await getMenuItems();

export default menuItems;
