import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Snackbar, CircularProgress, Alert, Link } from '@mui/material';

const AuthResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsResetMode(true);
    }
  }, [location]);

  const handleResetRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/forgotpassword', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', { token, newPassword: password });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setError('');
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '80px' }}>
      <Typography variant="h4" gutterBottom align="center">
        {isResetMode ? 'ตั้งรหัสผ่านใหม่' : 'รีเซ็ตรหัสผ่าน'}
      </Typography>
      {!isResetMode ? (
        <TextField
          label="ใส่อีเมลของคุณ"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '30px' }}
          InputLabelProps={{
            style: { fontSize: 12 },
          }}
        />
      ) : (
        <>
          <TextField
            label="รหัสผ่านใหม่"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '20px' }}
            InputLabelProps={{
              style: { fontSize: 12 },
            }}
          />
          <TextField
            label="ยืนยันรหัสผ่านใหม่"
            variant="outlined"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: '30px' }}
            InputLabelProps={{
              style: { fontSize: 12 },
            }}
          />
        </>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={isResetMode ? handlePasswordReset : handleResetRequest}
        disabled={(!isResetMode && !email) || (isResetMode && (!password || !confirmPassword)) || loading}
        style={{
          marginBottom: '20px',
          padding: '14px 0',
          fontSize: '14px',
          lineHeight: '1.5',
          minHeight: '48px',
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : (isResetMode ? 'ตั้งรหัสผ่านใหม่' : 'ส่งอีเมล')}
      </Button>
      <Snackbar open={!!message || !!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error ? 'error' : 'success'}>
          {error || message}
        </Alert>
      </Snackbar>
      <Container maxWidth="sm" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <Link
          onClick={() => navigate('/login')}
          style={{ fontSize: 15, textDecoration: 'auto', color: '#1976d2', cursor: 'pointer' }}
        >
          กลับหน้าล็อคอิน
        </Link>
      </Container>
    </Container>
  );
};

export default AuthResetPassword;