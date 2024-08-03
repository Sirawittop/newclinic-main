
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';


// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'ผู้ใช้',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'หน้าหลัก',
      type: 'item',
      url: '/dashboard',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: 'util-typography',
      title: 'จองคิวรักษาสัตว์',
      type: 'item',
      url: '/typography',
      icon: PetsIcon
    },
    {
      id: 'history-booking',
      title: 'ประวัติการจองคิว',
      type: 'item',
      url: '/Historybooking',
      icon: HistoryIcon
    },
   
  ]
};
export default utilities;
