// assets
import { CalendarOutlined } from '@ant-design/icons';

// icons
const icons = {
  CalendarOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const Dashboarduser = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboarduser',
      title: 'Dashboarduser',
      type: 'item',
      url: '/indexuser',
      icon: icons.CalendarOutlined,
      breadcrumbs: false
    },
  ]
};

export default Dashboarduser;