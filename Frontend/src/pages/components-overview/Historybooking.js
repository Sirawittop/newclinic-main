import React, { useEffect, useState } from 'react';
import axios from 'axios'; // If you're using axios
import './historybooking.css';

const Historybooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/historybookings'); // Update the URL to your backend endpoint
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th className="headerCell">วันที่จอง</th>
            <th className="headerCell">เวลาจอง</th>
            <th className="headerCell">จองคิวรักษาอะไร</th>
            <th className="headerCell">สถานะดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td className="cell">{booking.date}</td>
              <td className="cell">{booking.time}</td>
              <td className="cell">{booking.treatment}</td>
              <td className="cell">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Historybooking;
