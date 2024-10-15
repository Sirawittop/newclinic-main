
import PetsIcon from '@mui/icons-material/Pets';
import HistoryIcon from '@mui/icons-material/History';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';

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
      icon: AddToQueueIcon
    },
    {
      id: 'history-booking',
      title: 'ประวัติการจองคิว',
      type: 'item',
      url: '/Historybooking',
      icon: HistoryIcon
    },
    {
      id: "profile-pet",
      title: "เพิ่มข้อมูลสัตว์เลี้ยง",
      type: "item",
      url: "/ProfilePet",
      icon: PetsIcon
    }
  ]
};
export default utilities;
