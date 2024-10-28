import React, { useState, useEffect } from 'react';
import ReactHorizontalDatePicker from 'react-horizontal-strip-datepicker';
import 'react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css';
import Modal from 'react-modal';
import './Calendar.css';
import axios from 'axios';

Modal.setAppElement('#root');

const Calendar4 = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [userData, setUserData] = useState([{ name: '' }]);
  const [availableTimeRange, setAvailableTimeRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petName, setPetName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    appointmentType: '',
    selectedTime: '',
    symptoms: '',// Add symptoms field
    petName: ''
  });
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8002/api/usertoken', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setUserData(response.data.users);
      });

    // Fetch booked slots from the backend
    axios
      .get('http://localhost:8002/api/delslottime', {
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
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + 14);

    if (date > maxDate || date < currentDate) {
      alert('โปรดเลือกวันที่ระหว่างวันนี้และ 14 วันข้างหน้า');
      return;
    }

    setSelectedDate(date);
    let timeRange = [];
    switch (date.getDay()) {

      case 3: // Wednesday
        timeRange = 'วันนี้ร้านปิดค่ะ คุณสามารถจองคิวได้ในวันอื่นได้ค่ะ';
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

    const currentTime = new Date();
    const timeTwoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

    if (
      date.getDate() === currentTime.getDate() &&
      date.getMonth() === currentTime.getMonth() &&
      date.getFullYear() === currentTime.getFullYear()
    ) {
      const currentHour = timeTwoHoursLater.getHours();
      const currentMinutes = timeTwoHoursLater.getMinutes();

      if (Array.isArray(timeRange)) {
        timeRange = timeRange.filter((time) => {
          const [startTime] = time.split(' - ');
          const [startHour, startMinutes] = startTime.split(':').map(Number);
          return (
            startHour > currentHour ||
            (startHour === currentHour && startMinutes >= currentMinutes)
          );
        });
      }
    }

    setAvailableTimeRange(timeRange);
  };

  const handlePetNameChange = (e) => {
    setFormData({ ...formData, petName: e.target.value });
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const formatTime = (time) => {
    const [startTime] = time.split(' - ');
    const [hour] = startTime.split('.');
    return `${hour.padStart(2, '0')}:00`;
  };

  const acceptqueue = async () => {
    const data = {
      name: userData[0].name,
      phone: userData[0].numphone,
      email: userData[0].email,
      type: formData.appointmentType,
      time: formatTime(formData.selectedTime),
      date: formatDate(selectedDate),
      symptoms: formData.symptom,// Include symptoms in the data sent to the backend
      petName: formData.petName
    };



    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8002/api/booking', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('จองคิวสำเร็จ โปรดอ่านรายละเอียดการจองในอีเมล');
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการจองคิว');
    }
  };

  const handleTimeRangeSelect = (timeRange) => {
    setFormData({ ...formData, selectedTime: timeRange });
    axios.get('http://localhost:8002/api/namepet').then((response) => {
      setPetName(response.data.data);
    }
    );
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    acceptqueue();
  };

  const handleChangeUserData = (e, field) => {
    const value = e.target.value;
    setUserData((prevState) => [
      {
        ...prevState[0],
        [field]: value
      }
    ]);
  };

  const handleClose = () => {
    setFormData({ name: '', phone: '', email: '', appointmentType: '', selectedTime: '', symptom: '' }); // Reset the form data
    setIsModalOpen(false);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-zก-ฮ]*$/.test(value)) {
      handleChangeUserData(e, 'name');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      handleChangeUserData(e, 'numphone');
    }
  };

  const handleEmailChange = (e) => {
    handleChangeUserData(e, 'email');
  };

  const formatDateee = (date) => {
    console.log(date);
    const year = date.getFullYear() + 543;
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

    return `${day} ${monthMap[month]} ${year}`;
  };

  return (
    <div>
      <ReactHorizontalDatePicker selectedDay={handleSelectedDay} enableScroll={true} enableDays={180} color={'#987876'} />
      {selectedDate && bookedSlots && (
        <div>
          <p style={{ color: 'red' }}>วันที่ {formatDateee(selectedDate)}</p>
          {typeof availableTimeRange === 'string' ? (
            <p>{availableTimeRange}</p>
          ) : (
            <div>
              <p>เลือกช่วงเวลาที่ต้องการจอง</p>
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

                return isBooked ? (
                  <button
                    key={index}
                    onClick={() => handleTimeRangeSelect(timeRange)}
                    style={{ marginRight: '5px', marginTop: '10px' }}
                    disabled
                  >
                    {timeRange}
                  </button>
                ) : (
                  <button key={index} onClick={() => handleTimeRangeSelect(timeRange)} style={{ marginRight: '5px', marginTop: '10px' }}>
                    {timeRange}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => handleClose()}
        contentLabel="Input Form"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-container">
          <h2>กรอกข้อมูล</h2>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>
                ชื่อ
                <br />
                <input type="text" value={userData[0]?.name || ''} onChange={handleNameChange} required />
              </label>
              <br />
              <label>
                เบอร์โทร
                <br />
                <input type="tel" value={userData[0]?.numphone || ''} onChange={handlePhoneChange} required />
              </label>
              <br />
              <label>
                อีเมล
                <br />
                <input type="email" value={userData[0]?.email || ''} onChange={handleEmailChange} readOnly required />
              </label>
              <br />
              <br />
              <div>
                <label>
                  ชื่อสัตว์ที่เข้ารับการรักษา
                  <br />
                  <select value={formData.petName || ''} onChange={handlePetNameChange} required>
                    <option value="" disabled>เลือกสัตว์ที่ต้องการเข้ารักษา</option>
                    {petName &&
                      petName.map((name) => (
                        <option key={name.id} value={name.name}>
                          {name.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <label>
                ประเภทการจอง
                <br />
                <select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  required
                >
                  <option disabled value="">
                    โปรดเลือก
                  </option>
                  <option value="ฉีดวัคซีน">ฉีดวัคซีน</option>
                  <option value="ตรวจร่างกายทั่วไป">ตรวจร่างกายทั่วไป</option>
                  <option value="ตรวจเลือด">ตรวจเลือด/x-ray</option>
                </select>
              </label>
              <br />
              <label>
                อาการ
                <br />
                <input
                  type="text"
                  value={formData.symptom}
                  onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                />
              </label>
              <br />
            </div>
            <br />
            {formData.selectedTime && <p>เวลาที่เลือก: {formData.selectedTime}</p>}
            <br />
            <button type="submit">ยืนยัน</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              ยกเลิก
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar4;
