import { useState } from 'react';
import axios from 'axios'; // Import Axios

// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          numphone: '',
          email: '',
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().matches(/^\D*$/, 'ชื่อต้องประกอบด้วยตัวอักษรเท่านั้น').max(255).required('จำเป็นต้องใส่ชื่อ'),
          numphone: Yup.string()
            .matches(/^[0-9]*$/, 'หมายเลขเบอร์โทรศัพท์ต้องประกอบด้วยตัวเลขเท่านั้น')
            .max(10)
            .required('จำเป็นต้องใส่หมายเลขเบอร์โทรศัพท์'),
          email: Yup.string().email('ต้องเป็นรูปแบบอีเมลที่ถูกต้อง').max(255).required('จำเป็นต้องใส่อีเมล'),
          password: Yup.string().max(255).required('จำเป็นต้องใส่รหัสผ่าน'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'รหัสผ่านต้องตรงกัน')
            .required('จำเป็นต้องใส่รหัสผ่าน')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // Make POST request to your API endpoint
            const response = await axios.post('http://localhost:8000/api/register', values);
            // redirect to login page
            if (response.status === 201) {
              navigate('/login');
            }
            setStatus({ success: true });
            setSubmitting(false);
          } catch (err) {
            console.error('Registration failed', err.response?.data || err.message);
            setStatus({ success: false });
            setErrors({ submit: err.response?.data?.message || err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">ชื่อ</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="name-signup"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="สิรวิชญ์ คำชุ่ม"
                    error={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-name-signup">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="numphone-signup">เบอร์โทรศัพท์</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="numphone-signup"
                    type="text"
                    value={values.numphone}
                    name="numphone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="0895636594"
                    error={Boolean(touched.numphone && errors.numphone)}
                  />
                  {touched.numphone && errors.numphone && (
                    <FormHelperText error id="helper-text-numphone-signup">
                      {errors.numphone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">อีเมล</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@gmail.com"
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">รหัสผ่าน</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={Boolean(touched.password && errors.password)}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirmPassword-signup">ยืนยันรหัสผ่าน</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="confirmPassword-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="helper-text-confirmPassword-signup">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    สร้างบัญชีใหม่
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
