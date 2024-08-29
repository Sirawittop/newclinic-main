import React, { useEffect, useState } from "react";
import {
  Calendar,
  Year,
  Month,
  DatesStripe,
  ArrowButton,
  ActiveDate,
  Bottom,
  Middle,
  CalendarIcon,
  BackButtonContainer,
  Top,
  ReactCalendarContainer,
  CalendarIconContainer,
  BackButton
} from "./styles";
import {
  getCurrentWeek,
  getNextWeek,
  getPreviousWeek,
  getWeek
} from "./helpers/week";
import {
  getCurrentMonth,
  getCurrentYear,
  parseActiveDate
} from "./helpers/date";
import { showBackButton } from "./helpers/button";
import Week from "./components/week";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BsFillCalendarWeekFill } from "react-icons/bs";

export default function App() {
  const [weekData, setWeekData] = useState([]);
  const [currentDate, setCurrentDate] = useState();
  const [showCalendar, setShowCalendar] = useState(false);

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

  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar);
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
              setCurrentDate={setCurrentDate}
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
            <ActiveDate style={{
              fontSize: '20px',
              padding: '35px',
              textAlign: 'center',  // Center text horizontally
              display: 'flex',       // Use flexbox for vertical centering
              alignItems: 'center',  // Center text vertically
              justifyContent: 'center', // Center text horizontally
              borderRadius: '10px', // Optional: to match the rounded button look
              backgroundColor: '#blue' // Optional: background color for visibility
            }}>
              {parseActiveDate(currentDate)}
            </ActiveDate>

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
            <CalendarIcon onClick={handleShowCalendar}>
              <BsFillCalendarWeekFill size={60} style={{ color: "black" }} />
            </CalendarIcon>
          </CalendarIconContainer>
        </Bottom>
      </Calendar>
    </div>
  );
}
