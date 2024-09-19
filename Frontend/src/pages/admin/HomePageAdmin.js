import React, { useEffect, useState } from "react";
import axios from "axios";
import Week from "./components/week";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import { TextField } from '@mui/material';



import {
  getCurrentWeek,
  getNextWeek,
  getPreviousWeek,
  getWeek
} from "./helpers/week";
import {
  getCurrentMonth,
  getCurrentYear,
} from "./helpers/date";
import { showBackButton } from "./helpers/button";
import {
  Calendar,
  Year,
  Month,
  DatesStripe,
  ArrowButton,
  Bottom,
  Middle,
  BackButtonContainer,
  Top,
  ReactCalendarContainer,
  CalendarIconContainer,
  BackButton
} from "./styles";
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Input, Button } from 'antd';

export default function HomePageAdmin() {
  const [weekData, setWeekData] = useState([]);
  const [currentDate, setCurrentDate] = useState();
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [reservationId, setReservationId] = useState(null);
  const [showselected, setShowselected] = useState(false);
  const [formData, setFormData] = useState({
    appointmentType: '',
    datetimevalue: null,
    timeBlock: '',
  });

  const timeRange = [
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

  dayjs.extend(buddhistEra);
  dayjs.locale('th'); // Set locale to Thai



  useEffect(() => {
    let d = new Date();
    setCurrentDate(d);
    setWeekData(getCurrentWeek());
  }, []);

  const weekHandler = (e) => {
    setCurrentDate(undefined);
    setShowCalendar(false);
    if (e.currentTarget.value === "previous") {
      setWeekData(getPreviousWeek(weekData[0]));
    } else {
      setWeekData(getNextWeek(weekData[weekData.length - 1]));
    }
  };

  const handleClick = () => {
    let now = new Date();
    setCurrentDate(now);
    setWeekData(getCurrentWeek());
    setShowCalendar(false);
  };

  const handleDateChange = (dateValue) => {
    setCurrentDate(dateValue);
    setWeekData(getWeek(dateValue));
  };

  const formatstatus = (status) => {
    if (status === 1) {
      return { text: 'กำลังดำเนินการ', color: '#FFD700' }; // Yellow
    } else if (status === 2) {
      return { text: 'เสร็จสิ้น', color: '#4CAF50' }; // Green
    } else if (status === 3) {
      return { text: 'ไม่มา', color: '#FF0000' }; // Red
    }
  };

  const fetchData = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    axios.get(`http://localhost:8000/api/queuedoctor?targetDate=${formattedDate}`)
      .then(response => {
        setReservationData(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });

    setCurrentDate(date);
  };

  const formatDate = (date) => {
    if (!date) return '';

    try {
      const jsDate = new Date(date);
      const formatday = jsDate.getDate().toString().padStart(2, '0');
      const formatmonth = (jsDate.getMonth() + 1).toString().padStart(2, '0');
      const formatyear = (jsDate.getFullYear() + 543).toString();

      return `${formatday}/${formatmonth}/${formatyear}`;
    } catch (error) {
      console.error('Invalid date format', error);
      return 'ไม่พบข้อมูล';
    }
  };


  const formatTime = (time) => {
    if (!time) return '';
    return `${time.slice(0, 5)} น.`;
  };

  const handleIconClick = (id) => {
    setReservationId(id);
    setIsModalVisible(true);
    setCurrentNote(reservationData?.find(res => res.id === id)?.doctordescription);
  };

  const handleModalOk = async () => {
    try {
      const payload = {
        id: reservationId,
        doctordescription: currentNote,
      };

      const response = await axios.post('http://localhost:8000/api/doctordescription', payload);

      console.log(response.data.message);
      setIsModalVisible(false);

      alert('รายละเอียดการรักษาได้ถูกบันทึกเรียบร้อยแล้ว');
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);

      alert('ไม่สามารถบันทึกรายละเอียดการรักษาได้');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const vetcancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/vetcancelbooking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Booking canceled:", response.data);

      setReservationData(reservationData.filter(b => b.id !== bookingId));

      alert('ยกเลิกคิวสำเร็จ');
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const showConfirm = (bookingId) => {
    Modal.confirm({
      title: 'ยกเลิกการจอง',
      content: 'คุณแน่ใจหรือว่าต้องการยกเลิกการจองนี้?',
      okText: 'ใช่, ยกเลิก',
      cancelText: 'ไม่',
      centered: true,
      onOk: () => vetcancelBooking(bookingId),
    });
  };

  const handleClickAddDatetime = () => {
    if (showselected) {
      setShowselected(false);
    }
    else {
      setShowselected(true);
    }
  }

  const handleTimeBlockChange = (e) => {
    setFormData({ ...formData, timeBlock: e.target.value });
  };

  return (
    <div style={{ width: "1150px" }}>
      <Calendar style={{ width: "100%" }}>
        <Top>
          <Year>{getCurrentYear(weekData)}</Year>
          <Month>{getCurrentMonth(weekData)}</Month>
          <DatesStripe>
            <ArrowButton value="previous" onClick={weekHandler}>
              ⧏
            </ArrowButton>
            <Week
              weekData={weekData}
              setCurrentDate={fetchData}
              currentDate={currentDate}
            />
            <ArrowButton value="next" onClick={weekHandler}>
              ⧐
            </ArrowButton>
          </DatesStripe>
        </Top>
        <Middle>
          <BackButtonContainer style={{ justifyContent: "flex-start" }}>
            {!showBackButton(weekData)?.isCurrentWeek &&
              showBackButton(weekData)?.left ? (
              <BackButton style={{ padding: '15px 30px', fontSize: '20px' }} onClick={handleClick}>
                {"<< กลับไปวันนี้"}
              </BackButton>
            ) : null}
          </BackButtonContainer>
          {currentDate && (
            <div style={{
              padding: '35px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: 'auto',
              marginBottom: '20px',
              marginTop: '350px'
            }}>
              {reservationData && reservationData.length > 0 && (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderSpacing: '0',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ddd',
                  marginTop: '-20px'
                }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>วันที่</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>เวลา</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', whiteSpace: "nowrap" }}>ชื่อผู้จอง</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>เบอร์โทร</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', whiteSpace: "nowrap" }}>ประเภทการจอง</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', whiteSpace: "nowrap" }}>สถานะดำเนินการ</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>หมายเหตุ</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', whiteSpace: "nowrap" }}>ยกเลิกการจองคิว</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationData.map((reservation, index) => (
                      <tr key={index} style={{ backgroundColor: '#fff' }}>
                        <td style={{
                          padding: '8px',
                          fontSize: '14px',
                          color: '#575757',
                          border: '1px solid #ddd'
                        }}>
                          {formatDate(reservation.dataday)}
                        </td>
                        <td style={{
                          padding: '8px',
                          fontSize: '14px',
                          color: '#575757',
                          whiteSpace: 'nowrap',
                          border: '1px solid #ddd'
                        }}>
                          {formatTime(reservation.time)}
                        </td>
                        <td style={{
                          padding: '8px',
                          fontSize: '14px',
                          color: '#575757',
                          whiteSpace: 'nowrap',
                          border: '1px solid #ddd'
                        }}>
                          {reservation.name}
                        </td>
                        <td style={{
                          padding: '8px',
                          fontSize: '14px',
                          color: '#575757',
                          whiteSpace: 'nowrap',
                          border: '1px solid #ddd'
                        }}>
                          {reservation.numphone}
                        </td>
                        <td style={{
                          padding: '8px',
                          fontSize: '15px',
                          color: '#575757',
                          whiteSpace: 'nowrap',
                          border: '1px solid #ddd'
                        }}>
                          {reservation.reservation_type}
                        </td>
                        <td style={{
                          padding: '8px',
                          fontSize: '14px',
                          color: formatstatus(reservation.status).color,
                          whiteSpace: 'nowrap',
                          border: '1px solid #ddd',
                          fontWeight: 'bold'
                        }}>
                          {formatstatus(reservation.status).text}
                        </td>
                        <td style={{
                          padding: '8px',
                          fontSize: '14px',
                          color: '#575757',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {reservation.note}
                          <Button
                            icon={<FormOutlined />}
                            style={{
                              marginLeft: '8px',
                              color: reservation.status === 2 ? '#ff4d4f' : '#1890ff',
                              cursor: reservation.status === 2 || reservation.status === 3 ? 'not-allowed' : 'pointer',

                            }}
                            onClick={() => handleIconClick(reservation.id)}
                            disabled={reservation.status === 3 || reservation.status === 3}
                            aria-label="Edit Note"
                          />
                        </td>
                        <td style={{
                          padding: '8px',
                          border: '1px solid #ddd',
                          textAlign: 'center',
                          backgroundColor: '#fff'
                        }}>
                          <Button
                            icon={<DeleteOutlined />}
                            style={{
                              color: reservation.status === 2 || reservation.status === 3 ? '#d9d9d9' : '#ff4d4f',
                            }}
                            onClick={() => {
                              if (reservation.status !== 2 && reservation.status !== 3) {
                                showConfirm(reservation.id);
                              }
                            }}
                            aria-label="Cancel Booking"
                            disabled={reservation.status === 2 || reservation.status === 3}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          <BackButtonContainer style={{ justifyContent: "flex-end" }}>
            {!showBackButton(weekData)?.isCurrentWeek &&
              showBackButton(weekData)?.right ? (
              <BackButton style={{ padding: '15px 30px', fontSize: '20px' }} onClick={handleClick}>
                {"กลับไปวันนี้ >>"}
              </BackButton>
            ) : null}
          </BackButtonContainer>
        </Middle>
        <Bottom>
          <ReactCalendarContainer>
            {showCalendar && (
              <ReactCalendar
                onChange={handleDateChange}
                value={currentDate}
                calendarType="US"
              />
            )}
          </ReactCalendarContainer>
          <CalendarIconContainer>
            {/* Additional icons or actions can be added here */}
          </CalendarIconContainer>
        </Bottom>
      </Calendar>


      <Modal
        title="รายละเอียดการรักษา"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="บันทึก"
        cancelText="ยกเลิก"
        style={{ top: '20%' }}
        bodyStyle={{ textAlign: 'center' }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              key="nextAppointment"
              type="primary"
              onClick={() => handleClickAddDatetime()}
              disabled={reservationData?.find(res => res.id === reservationId)?.status === 2 || reservationData?.find(res => res.id === reservationId)?.status === 3}

            >
              นัดหมายครั้งถัดไป
            </Button>
            <div>
              <Button key="cancel" onClick={handleModalCancel}>
                ยกเลิก
              </Button>
              <Button
                key="save"
                type="primary"
                onClick={handleModalOk}
                style={{ marginLeft: '8px' }}
                disabled={reservationData?.find(res => res.id === reservationId)?.status === 2 || reservationData?.find(res => res.id === reservationId)?.status === 3}

              >
                บันทึก
              </Button>
            </div>
          </div>
        }
      >
        <Input.TextArea
          rows={4}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {showselected && (
          <div>
            <label>
              ประเภทการจอง
              <br />
              <select
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                required
                style={{ width: '50%', padding: '8px', boxSizing: 'border-box' }}
              >
                <option disabled value="">
                  โปรดเลือก
                </option>
                <option value="ฉีดวัคซีน">ฉีดวัคซีน</option>
                <option value="ตรวจร่างกายทั่วไป">ตรวจร่างกายทั่วไป</option>
                <option value="ตรวจเลือด">ตรวจเลือด/x-ray</option>
              </select>
            </label>

            <div style={{ marginTop: '10px' }}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="th"
                dateFormats={{ monthAndYear: 'MMMM BBBB' }}
              >
                <DatePicker
                  label="เลือกวันและเวลาจองครั้งถัดไป"
                  value={formData.datetimevalue}
                  onChange={(newValue) => setFormData({ ...formData, datetimevalue: newValue })}
                  format="DD MMMM BBBB"
                  formatDensity="spacious"
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  slots={{
                    textField: (params) => <TextField {...params} />,
                  }}
                />
              </LocalizationProvider>
            </div>

            {formData.appointmentType && formData.datetimevalue && (
              <div style={{ marginTop: '20px' }}>
                <label>
                  เลือกช่วงเวลา
                  <br />
                  <select
                    value={formData.timeBlock}
                    onChange={handleTimeBlockChange}
                    style={{ width: '50%', padding: '8px', boxSizing: 'border-box' }}
                  >
                    <option disabled value="">
                      โปรดเลือก
                    </option>
                    {timeRange.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
