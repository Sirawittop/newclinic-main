import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import NavGroup from './NavGroup';
import initializeMenuItems from 'menu-items';

const Navigation = () => {
  const [menuItems, setMenuItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await initializeMenuItems();
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
        setError('Failed to load navigation items');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center" sx={{ pt: 2 }}>
        {error}
      </Typography>
    );
  }

  const navGroups = menuItems?.items?.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;