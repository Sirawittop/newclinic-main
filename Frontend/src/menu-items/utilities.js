
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';


// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'ผู้ใช้',
  type: 'group',
  children: [
    {
      id: 'booking-queue',
      title: 'จองคิวรักษาสัตว์',
      type: 'item',

      url: '/BookingQueue',
      icon: PetsIcon
    },
    {
      id: 'history-booking',
      title: 'ประวัติการจองคิว',
      type: 'item',
      url: '/Historybooking',
      icon: HistoryIcon
    },
    {
      id: 'add-profile-pet',
      title: 'เพิ่มข้อมูลสัตว์เลี้ยง',
      type: 'item',
      url: '/AddProfilePet',
      icon: PetsIcon
    }

  ]
};
export default utilities;
