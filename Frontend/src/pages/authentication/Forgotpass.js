import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, TextField, Button, Snackbar, CircularProgress, Alert, Link } from '@mui/material';

const AuthForgotpass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/forgotpassword', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
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
        รีเซ็ตรหัสผ่าน
      </Typography>
      <TextField
        label="ใส่อีเมลของคุณ"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '30px' }}
        InputLabelProps={{
          style: { fontSize: 12 }, // Reduced font size for the label
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleResetPassword}
        disabled={!email || loading}
        style={{
          marginBottom: '20px',
          padding: '14px 0',    // Increased padding for more space
          fontSize: '14px',     // Reduced font size
          lineHeight: '1.5',    // Ensures proper line height
          minHeight: '48px',    // Set a minimum height for the button
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'ส่งอีเมล'}
      </Button>
      <Snackbar open={!!message || !!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error ? 'error' : 'success'}>
          {error || message}
        </Alert>
      </Snackbar>
      <Container maxWidth="sm" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <Link
          component={RouterLink}
          to="/Login"
          style={{ fontSize: 15, textDecoration: 'auto', color: '#1976d2' }}
        >
          กลับหน้าล็อคอิน
        </Link>
      </Container>
    </Container>
  );
};

export default AuthForgotpass;
