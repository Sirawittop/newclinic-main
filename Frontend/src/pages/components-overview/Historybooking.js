import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './historybooking.css';
import { FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import moment from 'moment'; // Import moment.js for date manipulation

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

        const response = await axios.get('http://localhost:8002/api/historybooking', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setBookings(response.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  console.log(selectedBooking);

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8002/api/cancelbooking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Booking canceled:", response.data);

      // Update state after cancellation
      setBookings(bookings.filter(b => b.id !== bookingId));

      // Display success alert
      alert('ยกเลิกคิวสำเร็จ');
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const confirmCancelBooking = (booking) => {
    const isBookingCancelable = isCancelable(booking.date, booking.time);

    if (!isBookingCancelable) {
      alert('ไม่สามารถยกเลิกได้ เนื่องจากเหลือน้อยกว่า 4 ชั่วโมงก่อนถึงเวลาที่จอง');
      return;
    }

    Modal.confirm({
      title: 'ยกเลิกการจอง',
      content: 'คุณแน่ใจหรือว่าต้องการยกเลิกการจองนี้?',
      okText: 'ใช่, ยกเลิก',
      cancelText: 'ไม่',
      centered: true,  // ทำให้ Modal เด้งขึ้นกลางจอ
      onOk: () => cancelBooking(booking.id),
    });
  };

  const formatstatus = (status) => {
    if (status === 1) {
      return <span style={{ color: '#FFD700' }}>กำลังดำเนินการ</span>;
    } else if (status === 2) {
      return <span style={{ color: '#4CAF50' }}>เสร็จสิ้น</span>;
    } else if (status === 3) {
      return <span style={{ color: '#FF0000' }}>ไม่มา</span>;
    }
  };

  const isCancelable = (bookingDate, bookingTime) => {
    const bookingDateTime = moment(`${bookingDate} ${bookingTime}`, 'YYYY-MM-DD HH:mm:ss');
    const now = moment();
    return bookingDateTime.diff(now, 'hours') >= 4;
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th className="headerCell">วันที่จอง</th>
            <th className="headerCell">เวลาจอง</th>
            <th className="headerCell">ประเภทการจอง</th>
            <th className="headerCell">สถานะดำเนินการ</th>
            <th className="headerCell">รายละเอียด</th>
            <th className="headerCell cancel-column">ยกเลิกการจองคิว</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td className="cell">{formatDate(booking.date)}</td>
              <td className="cell">{formatTime(booking.time)}</td>
              <td className="cell">{booking.reservation_type}</td>
              <td className="cell centered-cell">{formatstatus(booking.status)}</td>
              <td className="cell centered-cell">
                <button onClick={() => showModal(booking)}>
                  <FileTextOutlined />
                </button>
              </td>
              <td className="cell centered-cell cancel-column">
                <button
                  onClick={() => confirmCancelBooking(booking)}
                  disabled={booking.status === 2 || booking.status === 3} // Disable the button if status is "เสร็จสิ้น" or 3
                  style={{
                    color: booking.status === 2 || booking.status === 3 ? 'gray' : 'red', // Change color to gray when disabled
                    cursor: booking.status === 2 || booking.status === 3 ? 'not-allowed' : 'pointer' // Change cursor to not-allowed when disabled
                  }}
                >
                  <CloseCircleOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="รายละเอียดการจอง"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            ปิด
          </Button>
        ]}
        centered  // ทำให้ Modal เด้งขึ้นกลางจอ
      >
        {selectedBooking && (
          <div>
            <p>วันที่จอง: {formatDate(selectedBooking.date)}</p>
            <p>เวลาจอง: {formatTime(selectedBooking.time)}</p>
            <p>จองคิวรักษาอะไร: {selectedBooking.reservation_type}</p>
            <p>สถานะดำเนินการ: {formatstatus(selectedBooking.status)}</p>
            <p>รายละเอียดการเข้ารับการรักษา: {selectedBooking.doctordescription}</p>
            <p>อาการ: {selectedBooking.symptom}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Historybooking;