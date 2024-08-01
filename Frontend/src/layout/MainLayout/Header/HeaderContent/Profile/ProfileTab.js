import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { EditOutlined, LogoutOutlined, KeyOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const theme = useTheme();
  const navigate = useNavigate(); // ใช้ useNavigate

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);

    // นำทางไปยังหน้า Edit Profile เมื่อคลิก
    if (index === 1) {
      navigate('/edit_profile');
    }
    // นำทางไปยังหน้า Edit Password เมื่อคลิก
    if (index === 2) {
      navigate('/edit_password');
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="แก้ไขข้อมูลส่วนตัว" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <KeyOutlined />
        </ListItemIcon>
        <ListItemText primary="แก้ไขรหัสผ่าน" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 3} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="ออกจากระบบ" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
