import React, { useEffect, useState } from "react";
import axios from "axios";
import Week from "./components/week";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
import { FormOutlined } from '@ant-design/icons';
import { Modal, Input, Button } from 'antd';

export default function HomePageAdmin() {
  const [weekData, setWeekData] = useState([]);
  const [currentDate, setCurrentDate] = useState();
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [reservationId, setReservationId] = useState(null);

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
      return { text: 'ยกเลิก', color: '#FF0000' }; // Red
    }
  };

  const fetchData = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    console.log("Formatted Date:", formattedDate);

    axios.get(`http://localhost:8000/api/queuedoctor?targetDate=${formattedDate}`)
      .then(response => {
        console.log("Data fetched:", response.data.data);
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

  const formatTime = (date) => {
    if (!date) return '';

    const timePart = date.split('T')[1];
    const [hours, minutes] = timePart.split(':');
    return `${hours}:${minutes} น.`;
  };

  const handleIconClick = (id) => {
    setReservationId(id);
    setIsModalVisible(true);
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
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
            <div style={{ padding: '35px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100vh' }}>
              {reservationData && reservationData.length > 0 && (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderSpacing: '0',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ddd',
                }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>วันที่</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>เวลา</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', whiteSpace: "nowrap" }}>ชื่อผู้จอง</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>เบอร์โทร</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>ประเภทการจอง</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>สถานะดำเนินการ</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px' }}>หมายเหตุ</th>
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
                          {formatTime(reservation.dataday)}
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
                              cursor: reservation.status === 2 ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() => handleIconClick(reservation.id)}
                            disabled={reservation.status === 2}
                            aria-label="Edit Note"
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
      >
        <Input.TextArea
          rows={4}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
        />
      </Modal>
    </div>
  );
}