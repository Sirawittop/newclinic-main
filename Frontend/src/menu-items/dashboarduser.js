// assets
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const Dashboarduser = {
  id: 'group-dashboard',
  title: 'สัตวแพทย์',
  type: 'group',
  children: [
    {
      id: 'booking',
      title: 'การจอง',
      type: 'item',
      url: '/Booking',
      icon: MeetingRoomIcon
    },
    {
      id: 'dashboarduser',
      title: 'จัดตารางเวลาว่าง',
      type: 'item',
      url: '/indexuser',
      icon: EditCalendarIcon,
      breadcrumbs: false
    },

  ]
};

export default Dashboarduser;