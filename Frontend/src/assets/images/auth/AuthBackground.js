// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0 }}>
      <svg width="100%" height="calc(100vh - 175px)" viewBox="0 0 405 809" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          
        />
        <path

          fill={theme.palette.success.light}
          opacity="0.6"
        />
        <path
          fill={theme.palette.error.light}
          opacity="1"
        />
      </svg>
    </Box>
  );
};

export default AuthBackground;