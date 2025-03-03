import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';

// assets
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const [userData, setUserData] = useState([]); // get data from database use axios
  // get data from database use axios
  useEffect(() => {
    // get token from local storage
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8002/api/usertoken', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setUserData(response.data);
        localStorage.setItem('userId', JSON.stringify(response.data.users[0].id));
      });
  }, []);

  const theme = useTheme();

  const navigate = useNavigate();

  const isDataloaded = userData.length !== 0;

  const handleLogout = async () => {
    // logout
    localStorage.removeItem('token');
    navigate('/login');
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.300';

  // check token
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      {isDataloaded && (
        <>
          <ButtonBase
            sx={{
              p: 0.25,
              bgcolor: open ? iconBackColorOpen : 'transparent',
              borderRadius: 1,
              border: '2px solid black', // Added black border
              '&:hover': { bgcolor: 'secondary.lighter' }
            }}
            aria-label="open profile"
            ref={anchorRef}
            aria-controls={open ? 'profile-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
              <UserOutlined />
              <Typography variant="subtitle1">{userData.users[0].name}</Typography>
            </Stack>
          </ButtonBase>

          <Popper
            placement="bottom-end"
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 9]
                  }
                }
              ]
            }}
          >
            {({ TransitionProps }) => (
              <Transitions type="fade" in={open} {...TransitionProps}>
                {open && (
                  <Paper
                    sx={{
                      boxShadow: theme.customShadows.z1,
                      width: 290,
                      minWidth: 240,
                      maxWidth: 290,
                      [theme.breakpoints.down('md')]: {
                        maxWidth: 250
                      }
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <MainCard elevation={0} border={false} content={false}>
                        <CardContent sx={{ px: 2.5, pt: 3 }}>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                              <Stack direction="row" spacing={1.25} alignItems="center">
                                <Stack>
                                  <Typography variant="h6">{userData.users[0].name}</Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    อีเมล : {userData.users[0].email}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    โทรศัพท์: {userData.users[0].numphone}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>
                            <Grid item>
                              <IconButton size="large" color="secondary" onClick={handleLogout}>
                                <LogoutOutlined />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </CardContent>
                        {open && (
                          <>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                              <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                                <Tab
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textTransform: 'capitalize'
                                  }}
                                  icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                                  label="Profile"
                                  {...a11yProps(0)}
                                />
                              </Tabs>
                            </Box>
                            <TabPanel value={value} index={0} dir={theme.direction}>
                              <ProfileTab handleLogout={handleLogout} />
                            </TabPanel>
                          </>
                        )}
                      </MainCard>
                    </ClickAwayListener>
                  </Paper>
                )}
              </Transitions>
            )}
          </Popper>
        </>
      )}
    </Box>
  );
};

export default Profile;
