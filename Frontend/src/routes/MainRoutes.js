import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Editpassword from 'layout/MainLayout/Header/HeaderContent/Profile/Editpassword';
import ProtectedRoute from './ProtectedRoute';
import Addprofilepet from 'pages/components-overview/Addprofilepet';


// render - dashboard
const HomePageAdmin = Loadable(lazy(() => import('pages/admin/HomePageAdmin')));
const Historybooking = Loadable(lazy(() => import('pages/components-overview/Historybooking')));
const BookingQueue = Loadable(lazy(() => import('pages/components-overview/BookingQueue')));
const Editprofile = Loadable(lazy(() => import('layout/MainLayout/Header/HeaderContent/Profile/Editprofile.js')));
const Dashboarduser = Loadable(lazy(() => import('pages/dashboard/timemanagevet.js')));

// ==============================|| MAIN ROUTING ||============================== //


const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute element={BookingQueue} roles={1} />
    },
    {
      path: 'BookingQueue',
      element: <ProtectedRoute element={BookingQueue} roles={1} />
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
      path: '/timemanagevet',
      element: <ProtectedRoute element={Dashboarduser} roles={2} /> // Admin only

    },
    {
      path: '/Historybooking',
      element: <ProtectedRoute element={Historybooking} roles={1} /> // Admin only

    },
    {
      path: '/ProfilePet',
      element: <ProtectedRoute element={Addprofilepet} roles={1} /> // Admin only
    }
  ]
};

export default MainRoutes;
