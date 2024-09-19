// assets
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
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
      icon: HomeOutlined,
      breadcrumbs: false
    },
    {
      id: 'dashboarduser',
      title: 'จัดตารางเวลาว่าง',
      type: 'item',
      url: '/timemanagevet',
      icon: EditCalendarIcon,
      breadcrumbs: false
    },



  ]
};

export default Dashboarduser;