// assets
import { CalendarOutlined } from '@ant-design/icons';

// icons
const icons = {
  CalendarOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.CalendarOutlined,
      breadcrumbs: false
    },
  ]
};

export default dashboard;


