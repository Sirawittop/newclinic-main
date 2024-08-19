import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Editpassword from 'layout/MainLayout/Header/HeaderContent/Profile/Editpassword';
import ProtectedRoute from './ProtectedRoute';



// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const HomePageAdmin = Loadable(lazy(() => import('pages/admin/HomePageAdmin')));
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
      element: <ProtectedRoute element={DashboardDefault} roles={1} /> 
    },
    {
      path: 'dashboard',
      element: <ProtectedRoute element={DashboardDefault} roles={1} />
    },
    {
      path: 'typography',
      element: <ProtectedRoute element={Typography} roles={1} /> 
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
      path: '/',
      element: <ProtectedRoute element={HomePageAdmin} roles={2} /> // Admin only
    },
    {
      path: '/HomePageAdmin',
      element: <ProtectedRoute element={HomePageAdmin} roles={2} /> // Admin only
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
