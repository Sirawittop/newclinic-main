import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// import the logo
import logo from 'assets/images/logoclinic.jpg';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
          <img src={logo} alt="Logo" style={{ height: 160 }} />
        </Stack>
        <h4 style={{ textAlign: 'center' }}>แอปพลิเคชันจองคิวรักษาสัตว์คลินิคแสนสุขรักษาสัตว์</h4>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">เข้าสู่ระบบ</Typography>
          <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            ยังไม่มีบัญชีใช่หรือไม่?
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
