import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Editpassword from 'layout/MainLayout/Header/HeaderContent/Profile/Editpassword';
import ProtectedRoute from './ProtectedRoute';



// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
// render - sample page
const Historybooking = Loadable(lazy(() => import('pages/components-overview/Historybooking')));
const Booking = Loadable(lazy(() => import('pages/components-overview/Booking')));
// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Editprofile = Loadable(lazy(() => import('layout/MainLayout/Header/HeaderContent/Profile/Editprofile.js')));
const Dashboarduser = Loadable(lazy(() => import('pages/dashboard/indexuser.js')));

// ==============================|| MAIN ROUTING ||============================== //


const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute element={DashboardDefault} roles={1} /> // Admin only
    },
    {
      path: 'dashboard',
      element: <ProtectedRoute element={DashboardDefault} roles={1} /> // Admin only
    },
    {
      path: 'typography',
      element: <ProtectedRoute element={Typography} roles={1} /> // Admin only
    },
    {
      path: 'edit_profile',
      element: <Editprofile /> 
    },
    {
      path: 'edit_password',
      element: <Editpassword />
    },
    {
      path: '/indexuser',
      element: <ProtectedRoute element={Dashboarduser} roles={2} /> // Admin only

    },
    {
      path: '/Historybooking',
      element: <ProtectedRoute element={Historybooking} roles={1} /> // Admin only

    },
    {
      path: '/Booking',
      element: <ProtectedRoute element={Booking} roles={2} /> // Admin only
    }
  ]
};

export default MainRoutes;
