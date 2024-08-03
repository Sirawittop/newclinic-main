import React from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({ fullName: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // Ensure token exists before making the request
    if (token) {
      axios
        .get('http://localhost:8000/api/usertoken', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          // Assuming response.data.users is an array
          if (response.data.users && response.data.users.length > 0) {
            setFullName(response.data.users[0].name);
            setEmail(response.data.users[0].email);
            setPhoneNumber(response.data.users[0].numphone);
          } else {
            console.warn('No user data found in response');
            navigate('/login'); // Redirect to login if no user data
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/login'); // Redirect to login on error
        });
    } else {
      console.warn('No token found in local storage');
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]); // Add navigate to dependency array

  const handleFullNameChange = (e) => {
    const { value } = e.target;
    const nameRegex = /^[^\d]*$/; // Regular expression to disallow numbers
    if (nameRegex.test(value)) {
      setFullName(value);
      setErrors((prev) => ({ ...prev, fullName: '' }));
    } else {
      setErrors((prev) => ({ ...prev, fullName: 'ชื่อผู้ใช้ไม่ควรมีตัวเลข' }));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const phoneRegex = /^[0-9]*$/; // Regular expression to allow only numbers
    if (phoneRegex.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    } else if (value.length > 10) {
      setErrors((prev) => ({ ...prev, phoneNumber: 'หมายเลขโทรศัพท์ควรมีไม่เกิน 10 ตัวเลข' }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: 'หมายเลขโทรศัพท์ควรมีเฉพาะตัวเลข' }));
    }
  };

  const editprofilesave = async () => {
    console.log('editprofilesave');
    const token = localStorage.getItem('token');
    axios
      .put(
        'http://localhost:8000/api/editprofile',
        {
          name: fullName,
          email: email,
          numphone: phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(() => {
        setIsSuccess(true);
        setMessage('แก้ไขสำเร็จ');
        setSnackbarOpen(true);
      })
      .catch(() => {
        setIsSuccess(false);
        setMessage('แก้ไขไม่สำเร็จ');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4
      }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        margin="normal"
        fullWidth
        value={fullName}
        onChange={handleFullNameChange}
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
      />

      <TextField label="Email" variant="outlined" margin="normal" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />

      <TextField
        label="Phone Number"
        variant="outlined"
        margin="normal"
        fullWidth
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        error={Boolean(errors.phoneNumber)}
        helperText={errors.phoneNumber}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={editprofilesave}>
        Save Changes
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'middle', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={isSuccess ? 'success' : 'error'} sx={{ width: '300px' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
