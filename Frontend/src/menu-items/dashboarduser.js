// assets
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const Dashboarduser = {
  id: 'group-dashboard',
  title: 'สัตวแพทย์',
  type: 'group',
  children: [
    {
      id: 'HomePageAdmin',
      title: 'หน้าหลักหมอ',
      type: 'item',
      url: '/HomePageAdmin',
      icon: HomeOutlined ,
      breadcrumbs: false
    },
    {
      id: 'dashboarduser',
      title: 'จัดตารางเวลาว่าง',
      type: 'item',
      url: '/indexuser',
      icon: EditCalendarIcon,
      breadcrumbs: false
    },
    {
      id: 'booking',
      title: 'การจอง',
      type: 'item',
      url: '/Booking',
      icon: MeetingRoomIcon
    }
  


  ]
};

export default Dashboarduser;