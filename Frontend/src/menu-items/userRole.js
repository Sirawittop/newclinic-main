const fetchUserRole = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/userRole', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data.userRole; // Adjust based on your API response
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      return null; // or default role if needed
    }
  };