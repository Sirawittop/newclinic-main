import React, { useEffect, useState } from 'react';
import axios from 'axios'; // If you're using axios
import './historybooking.css';
import { FileTextOutlined } from '@ant-design/icons'; // Import the icon
import { CloseCircleOutlined } from '@ant-design/icons'; // Import the icon

const Historybooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
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
    
        setBookings(response.data.data); // Assuming the data is within the `data` property
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    
    fetchBookings();
  }, []);

  const handleDetailClick = (booking) => {
    // Perform the desired action when the detail icon is clicked
    console.log('Detail clicked for booking:', booking);
    // For example, you can open a modal with detailed information
  };

  const handleCancelClick = (booking) => {
    // Handle the cancel booking action here
    console.log('Cancel clicked for booking:', booking);
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
              <td className="cell">{booking.date}</td>
              <td className="cell">{booking.time}</td>
              <td className="cell">{booking.reservation_type}</td>
              <td className="cell">{booking.status}</td>
              <td className="cell">
                <button onClick={() => handleDetailClick(booking)}>
                  <FileTextOutlined />
                </button>
              </td>
              <td className="cell">
                <button onClick={() => handleCancelClick(booking)}><CloseCircleOutlined /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Historybooking;
