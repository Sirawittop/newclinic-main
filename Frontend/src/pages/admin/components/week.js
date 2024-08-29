import React from "react";
import { WeekWrapper, DayContainer, WeekDay, Day } from "../styles";
import { onlyDayNum, isToday } from "../helpers/date";

export default function Week({ weekData, setCurrentDate, currentDate }) {
    const weekdays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];


    return (
        <WeekWrapper>
            {weekData.map((date, index) => (
                <DayContainer key={index}>
                    <WeekDay>{weekdays[date.getDay()]}</WeekDay>
                    <Day
                        background={
                            currentDate && currentDate.toDateString() === date.toDateString()
                                ? "grey"
                                : undefined
                        }
                        bigger={currentDate && currentDate.toDateString() === date.toDateString()}
                        onClick={() => setCurrentDate(date)}
                        today={isToday(date)}
                    >
                        {onlyDayNum(date)}
                    </Day>
                </DayContainer>
            ))}
        </WeekWrapper>
    );
}
