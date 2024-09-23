import React, { useState, useEffect } from 'react';
import ReactHorizontalDatePicker from 'react-horizontal-strip-datepicker';
import 'react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css';
import './timemanagevet.css';
import axios from 'axios';
import Container from '@mui/material/Container';

const TimeManageVet = () => {
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

  useEffect(() => {
    const dayMap = {
      'Mon': 'จันทร์',
      'Tue': 'อังคาร',
      'Wed': 'พุธ',
      'Thu': 'พฤหัสบดี',
      'Fri': 'ศุกร์',
      'Sat': 'เสาร์',
      'Sun': 'อาทิตย์'
    };

    const monthMap = {
      'Jan': 'ม.ค.',
      'Feb': 'ก.พ.',
      'Mar': 'มี.ค.',
      'Apr': 'เม.ย.',
      'May': 'พ.ค.',
      'Jun': 'มิ.ย.',
      'Jul': 'ก.ค.',
      'Aug': 'ส.ค.',
      'Sep': 'ก.ย.',
      'Oct': 'ต.ค.',
      'Nov': 'พ.ย.',
      'Dec': 'ธ.ค.'
    };

    const translateNames = () => {
      // Translate day names
      document.querySelectorAll('.datepicker-day-label').forEach(element => {
        const englishDay = element.textContent.trim();
        if (dayMap[englishDay]) {
          element.textContent = dayMap[englishDay];
        }
      });

      // Translate month abbreviations
      document.querySelectorAll('.scroll-head').forEach(element => {
        const englishMonth = element.textContent.trim();
        if (monthMap[englishMonth]) {
          element.textContent = monthMap[englishMonth];
        }
      });
    };

    const observer = new MutationObserver(() => {
      translateNames();
    });

    const calendarContainer = document.querySelector('.main-container');
    if (calendarContainer) {
      observer.observe(calendarContainer, { childList: true, subtree: true });
    }

    // Initial translation on component mount
    translateNames();

    return () => {
      if (calendarContainer) {
        observer.disconnect();
      }
    };
  }, []);

  const handleSelectedDay = (date) => {
    setSelectedDate(date);
    setSelectedTimes([]);
    setSelectAll(false);

    let timeRange = [];
    switch (date.getDay()) {
      case 0:
      case 3:
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

  // New formatDate function for Buddhist year and Thai months
  function formatDate(date) {
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const monthMap = {
      '01': 'มกราคม',
      '02': 'กุมภาพันธ์',
      '03': 'มีนาคม',
      '04': 'เมษายน',
      '05': 'พฤษภาคม',
      '06': 'มิถุนายน',
      '07': 'กรกฎาคม',
      '08': 'สิงหาคม',
      '09': 'กันยายน',
      '10': 'ตุลาคม',
      '11': 'พฤศจิกายน',
      '12': 'ธันวาคม'
    };


    return `${day} ${monthMap[month]} ${year}`; // Return Thai date format
  }

  const formatTime = (time) => {
    const [startTime] = time.split(' - ');
    const [hour] = startTime.split('.');
    return `${hour.padStart(2, '0')}:00`;
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
      setSelectedTimes([]);
    } else {
      const availableTimes = availableTimeRange.filter((timeRange) => {
        const dateKey = selectedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: '2-digit'
        });
        const startTime = timeRange.split(' - ')[0];
        const isBooked = bookedSlots.some((slot) => {
          return slot.dataday === dateKey && slot.time === startTime;
        });
        return !isBooked;
      });

      setSelectedTimes(availableTimes);
    }
    setSelectAll(!selectAll);
  };

  const bookSlots = async () => {
    const token = localStorage.getItem('token');
    try {
      for (const timeRange of selectedTimes) {
        const data = {
          time: formatTime(timeRange),
          date: formatDate(selectedDate), // Use the new formatDate
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
          dataday: formatDate(selectedDate), // Use the new formatDate
          time: timeRange.split(' - ')[0]
        }))
      ]);

      alert('จองคิวสำเร็จ');
      setSelectedTimes([]);
      setSelectAll(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการจองคิว');
    }
  };

  return (
    <Container maxWidth="md">
      <div className="main-container">
        <ReactHorizontalDatePicker
          selectedDay={handleSelectedDay}
          enableScroll={true}
          enableDays={180}
          color={'#987876'}
        />
        {selectedDate && bookedSlots && (
          <div>
            <p style={{ color: 'red' }}>วันที่ {formatDate(selectedDate)}</p>
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
                  const startTime = timeRange.split(' - ')[0];
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
                  <button className="btn btn-primary" onClick={bookSlots}>
                    บันทึกการจอง
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

export default TimeManageVet;
