import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const EditPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmNewPassword: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);

    // Check for password strength or other validation rules here if needed
    setErrors((prev) => ({ ...prev, newPassword: '' }));
  };

  const handleConfirmNewPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmNewPassword(value);

    if (value !== newPassword) {
      setErrors((prev) => ({ ...prev, confirmNewPassword: 'รหัสผ่านใหม่ไม่ตรงกัน' }));
    } else {
      setErrors((prev) => ({ ...prev, confirmNewPassword: '' }));
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const editPasswordSave = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrors((prev) => ({ ...prev, confirmNewPassword: 'รหัสผ่านใหม่ไม่ตรงกัน' }));
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:8002/api/editpassword',
        {
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSnackbarOpen(true);
      setIsSuccess(true);
      setMessage('บันทึกรหัสผ่านสำเร็จ');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error(error);
      setErrorMessage('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      setSnackbarOpen(true);
      setIsSuccess(false);
      setMessage('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
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
        แก้ไขรหัสผ่าน
      </Typography>
      {errorMessage && (
        <Typography color="error" id="error-message">
          {errorMessage}
        </Typography>
      )}
      <TextField
        label="รหัสผ่านเดิม"
        variant="outlined"
        margin="normal"
        fullWidth
        type={showPassword ? 'text' : 'password'}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        label="รหัสผ่านใหม่"
        variant="outlined"
        margin="normal"
        fullWidth
        type={showPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={handleNewPasswordChange}
        error={Boolean(errors.newPassword)}
        helperText={errors.newPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        label="ยืนยันรหัสผ่านใหม่"
        variant="outlined"
        margin="normal"
        fullWidth
        type={showPassword ? 'text' : 'password'}
        value={confirmNewPassword}
        onChange={handleConfirmNewPasswordChange}
        error={Boolean(errors.confirmNewPassword)}
        helperText={errors.confirmNewPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={editPasswordSave}>
        บันทึกรหัสผ่าน
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

export default EditPassword;
