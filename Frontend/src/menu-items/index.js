import axios from 'axios';
import utilities from './utilities';
import dashboarduser from './dashboarduser';

// Function to get user role from backend
const getUserRole = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/userRole', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.role;
  } catch (error) {
    console.error('Failed to fetch user role:', error);
    return null;
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

// Create a function to initialize menu items after login
const initializeMenuItems = async () => {
  const menuItems = await getMenuItems();
  return menuItems;
};

// Export the initialization function instead of the menu items directly
export default initializeMenuItems;