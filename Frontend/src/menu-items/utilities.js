// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  BookOutlined,
  SolutionOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  BookOutlined,
  SolutionOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'history-booking',
      title: 'History Booking',
      type: 'item',
      url: '/Historybooking',
      icon: icons.BookOutlined
    },
    {
      id: 'booking',
      title: 'Booking',
      type: 'item',
      url: '/Booking',
      icon: icons.SolutionOutlined
    }
  ]
};
export default utilities;
