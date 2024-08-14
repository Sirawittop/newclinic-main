import React, { useState, useEffect } from 'react';
import ReactHorizontalDatePicker from 'react-horizontal-strip-datepicker';
import 'react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css';
import './indexuser.css';
import axios from 'axios';
import Container from '@mui/material/Container';
import MuiTypography from '@mui/material/Typography';

const IndexUser = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeRange, setAvailableTimeRange] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8000/api/delslottime', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setBookedSlots(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching booked slots:', error);
      });
  }, []);

  const handleSelectedDay = (date) => {
    setSelectedDate(date);
    setSelectedTimes([]); // Clear selected times when a new date is selected
    setSelectAll(false); // Reset the "Select All" checkbox

    let timeRange = [];
    switch (date.getDay()) {
      case 0: // Sunday
      case 3: // Wednesday
        timeRange = 'วันนี้ร้านปิดค่ะ';
        break;
      default:
        timeRange = [
          '12:00 - 12:30',
          '12:30 - 13:00',
          '13:00 - 13:30',
          '13:30 - 14:00',
          '14:00 - 14:30',
          '14:30 - 15:00',
          '15:00 - 15:30',
          '15:30 - 16:00',
          '16:00 - 16:30',
          '16:30 - 17:00',
          '17:00 - 17:30',
          '17:30 - 18:00',
          '18:00 - 18:30',
          '18:30 - 19:00',
          '19:00 - 19:30'
        ];
        break;
    }

    setAvailableTimeRange(timeRange);
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const formatTime = (time) => {
    const [startTime] = time.split(' - ');
    const [hour] = startTime.split('.'); // Split the time string by '.'
    return `${hour.padStart(2, '0')}:00`; // Pad the hour with leading zero if needed and append ':00:00'
  };

  const handleCheckboxChange = (timeRange) => {
    setSelectedTimes((prevSelectedTimes) => {
      if (prevSelectedTimes.includes(timeRange)) {
        return prevSelectedTimes.filter((time) => time !== timeRange);
      } else {
        return [...prevSelectedTimes, timeRange];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTimes([]); // Deselect all if already selected
    } else {
      setSelectedTimes(availableTimeRange); // Select all available time slots
    }
    setSelectAll(!selectAll); // Toggle the selectAll state
  };

  const bookSlots = async () => {
    const token = localStorage.getItem('token');
    try {
      for (const timeRange of selectedTimes) {
        const data = {
          time: formatTime(timeRange),
          date: formatDate(selectedDate),
          status: 1
        };
        await axios.post('http://localhost:8000/api/booking', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      setBookedSlots([
        ...bookedSlots,
        ...selectedTimes.map((timeRange) => ({
          dataday: selectedDate.toLocaleDateString(),
          time: timeRange.split(' - ')[0]
        }))
      ]);

      alert('จองคิวสำเร็จ');
      setSelectedTimes([]);
      setSelectAll(false);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการจองคิว');
    }
  };

  return (
    <Container maxWidth="md">
      <MuiTypography variant="h3" align="center" gutterBottom>
        
      </MuiTypography>
      <div className="main-container">
        <ReactHorizontalDatePicker selectedDay={handleSelectedDay} enableScroll={true} enableDays={180} color={'#987876'} />
        {selectedDate && bookedSlots && (
          <div>
            <p>วันที่เลือก {selectedDate.toLocaleDateString()}</p>
            {typeof availableTimeRange === 'string' ? (
              <p>{availableTimeRange}</p>
            ) : (
              <div>
                <p>เลือกช่วงเวลาที่ต้องการลบ</p>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" style={{ marginLeft: '5px' }}>
                    เลือกทั้งหมด
                  </label>
                </div>
                {availableTimeRange.map((timeRange, index) => {
                  const dateKey = selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: '2-digit'
                  });
                  const startTime = timeRange.split(' - ')[0]; // Extract the start time
                  const isBooked = bookedSlots.some((slot) => {
                    return slot.dataday === dateKey && slot.time === startTime;
                  });

                  return (
                    <div key={index} style={{ marginRight: '5px', marginTop: '10px' }}>
                      <input
                        type="checkbox"
                        id={`time-${index}`}
                        disabled={isBooked}
                        checked={selectedTimes.includes(timeRange)}
                        onChange={() => handleCheckboxChange(timeRange)}
                      />
                      <label htmlFor={`time-${index}`} style={{ marginLeft: '3px' }}>
                        {timeRange}
                      </label>
                    </div>
                  );
                })}
                {selectedTimes.length > 0 && (
                  <button onClick={bookSlots} style={{ margintop: '5px' , }}>
                    ลบคิวจอง
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default IndexUser;
