import React, { useEffect, useState } from "react";
import axios from "axios";
import Week from "./components/week";
import ReactCalendar from "react-calendar"; // Import ReactCalendar
import "react-calendar/dist/Calendar.css"; // Import the calendar's CSS for styling
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

export default function HomePageAdmin() {
  const [weekData, setWeekData] = useState([]);
  const [currentDate, setCurrentDate] = useState();
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservationData, setReservationData] = useState(null)

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

  // Axios request function to fetch data based on the selected date
  const fetchData = (date) => {
    // Convert the date to YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // Days are 1-based

    const formattedDate = `${year}-${month}-${day}`;

    console.log("Formatted Date:", formattedDate);

    axios.get(`http://localhost:8000/api/queuedoctor?targetDate=${formattedDate}`)
      .then(response => {
        // Handle the response data here
        console.log("Data fetched:", response.data.data);
        setReservationData(response.data.data)
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });

    setCurrentDate(date);
  };

  const formatDate = (date) => {
    if (!date) return '';

    try {
      // Convert the input date to a JavaScript Date object
      const jsDate = new Date(date);

      // Extract the day, month, and year parts
      const formatday = jsDate.getDate().toString().padStart(2, '0');
      const formatonth = (jsDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
      const formatyear = (jsDate.getFullYear() + 543).toString(); // Convert Gregorian year to Buddhist year

      // Format as "dd/mm/yyyy"
      return `${formatday}/${formatonth}/${formatyear}`;
    } catch (error) {
      console.error('Invalid date format', error);
      return 'ไม่พบข้อมูล';
    }
  };


  const formatTime = (date) => {
    if (!date) return '';
    return date.split('T')[1].split('.')[0];
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
              setCurrentDate={fetchData} // Pass Axios fetch function to Week component
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
                {"<< back to today"}
              </BackButton>
            ) : null}
          </BackButtonContainer>
          {currentDate && (
            <div style={{ padding: '35px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5' // Optional: background color for visibility
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
                  {reservationData
                    ? reservationData.map((reservation, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0 10px', fontSize: '14px', color: '#575757' }}>
                          {formatDate(reservation.dataday)}

                        </td>
                        <td
                          style={{
                            padding: '0 10px',
                            fontSize: '14px',
                            color: '#575757',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatTime(reservation.dataday)}
                        </td>
                        <td
                          style={{
                            padding: '0 10px',
                            fontSize: '14px',
                            color: '#575757',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {reservation.name}
                        </td>
                        <td
                          style={{
                            padding: '0 10px',
                            fontSize: '14px',
                            color: '#575757',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {reservation.numphone}
                        </td>
                        <td
                          style={{
                            padding: '0 10px',
                            fontSize: '14px',
                            color: '#575757',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {reservation.reservation_type}
                        </td>
                        <td
                          style={{
                            padding: '0 10px',
                            fontSize: '14px',
                            color: '#575757',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {reservation.status}
                        </td>

                      </tr>
                    ))
                    : null}
                </tbody>
              </table>
            </div>
          )}
          <BackButtonContainer style={{ justifyContent: "flex-end" }}>
            {!showBackButton(weekData)?.isCurrentWeek &&
              showBackButton(weekData)?.right ? (
              <BackButton style={{ padding: '15px 30px', fontSize: '20px' }} onClick={handleClick}>
                {"back to today >>"}
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
    </div>
  );
}
