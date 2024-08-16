import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './historybooking.css';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd'; // Removed unused Button import

const Historybooking = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found in local storage');
        }
    
        const response = await axios.get('http://localhost:8000/api/historybooking', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        setBookings(response.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`; // Reformat to Day/Month/Year
  };

  const formatTime = (timeString) => {
    return `${timeString.slice(0, 5)} น.`; // Show only HH:mm and add "น."
  };

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th className="headerCell">วันที่จอง</th>
            <th className="headerCell">เวลาจอง</th>
            <th className="headerCell">จองคิวรักษาอะไร</th>
            <th className="headerCell">สถานะดำเนินการ</th>
            <th className="headerCell">รายละเอียด</th>
            <th className="headerCell">ยกเลิกการจองคิว</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td className="cell">{formatDate(booking.date)}</td> {/* Format date to Day/Month/Year */}
              <td className="cell">{formatTime(booking.time)}</td> {/* Show only HH:mm and add "น." */}
              <td className="cell">{booking.reservation_type}</td>
              <td className="cell">{booking.status}</td>
              <td className="cell">
                <button onClick={() => showModal(booking)}>
                  <FileTextOutlined />
                </button>
              </td>
              <td className="cell">
                <button onClick={() => showModal(booking)}>
                  <CloseCircleOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal title="รายละเอียดการจอง" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {selectedBooking && (
          <div>
            <p>วันที่จอง: {formatDate(selectedBooking.date)}</p> {/* Format date to Day/Month/Year */}
            <p>เวลาจอง: {formatTime(selectedBooking.time)}</p> {/* Show only HH:mm and add "น." */}
            <p>จองคิวรักษาอะไร: {selectedBooking.reservation_type}</p>
            <p>สถานะดำเนินการ: {selectedBooking.status}</p>
            <p>รายละเอียดการเข้ารับการรักษา: {selectedBooking.details}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Historybooking;
