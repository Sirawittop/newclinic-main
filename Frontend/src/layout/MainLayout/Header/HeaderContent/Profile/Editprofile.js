import React from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({ fullName: '', email: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:8000/api/usertoken', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (response.data.users && response.data.users.length > 0) {
            setFullName(response.data.users[0].name);
            setEmail(response.data.users[0].email);
            setPhoneNumber(response.data.users[0].numphone);
          } else {
            console.warn('No user data found in response');
            navigate('/login');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/login');
        });
    } else {
      console.warn('No token found in local storage');
      navigate('/login');
    }
  }, [navigate]);

  const handleFullNameChange = (e) => {
    const { value } = e.target;
    const nameRegex = /^[^\d]*$/;
    if (nameRegex.test(value)) {
      setFullName(value);
      setErrors((prev) => ({ ...prev, fullName: '' }));
    } else {
      setErrors((prev) => ({ ...prev, fullName: 'ชื่อผู้ใช้ไม่ควรมีตัวเลข' }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const phoneRegex = /^[0-9]*$/;
    if (phoneRegex.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    } else if (value.length > 10) {
      setErrors((prev) => ({ ...prev, phoneNumber: 'หมายเลขโทรศัพท์ควรมีไม่เกิน 10 ตัวเลข' }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: 'หมายเลขโทรศัพท์ควรมีเฉพาะตัวเลข' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { fullName: '', email: '', phoneNumber: '' };

    if (!fullName) {
      newErrors.fullName = 'โปรดใส่ชื่อ';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'โปรดใส่อีเมล';
      valid = false;
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'โปรดใส่เบอร์โทรศัพท์';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const editprofilesave = async () => {
    if (validateForm()) {
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
    } else {
      setIsSuccess(false);
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setSnackbarOpen(true);
    }
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
        แก้ไขโปรไฟล์
      </Typography>
      <TextField
        label="ชื่อ"
        variant="outlined"
        margin="normal"
        fullWidth
        value={fullName}
        onChange={handleFullNameChange}
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
      />

      <TextField
        label="อีเมล"
        variant="outlined"
        margin="normal"
        fullWidth
        value={email}
        onChange={handleEmailChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <TextField
        label="เบอร์โทรศัพท์"
        variant="outlined"
        margin="normal"
        fullWidth
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        error={Boolean(errors.phoneNumber)}
        helperText={errors.phoneNumber}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={editprofilesave}
      >
        บันทึกข้อมูล
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
