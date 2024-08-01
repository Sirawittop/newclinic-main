import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Editpassword from 'layout/MainLayout/Header/HeaderContent/Profile/Editpassword';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
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
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'typography',
      element: <Typography />
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
      element: <Dashboarduser />
    },
    {
      path: '/Historybooking',
      element: <Historybooking />
    },
    {
      path: '/Booking',
      element: <Booking />
    }
  ]
};

export default MainRoutes;
