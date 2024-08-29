import styled from "styled-components";

// App
export const Calendar = styled.div`
  background: white;
  height: 90vh;
  width: 90vw;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Top = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Year = styled.span`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const Month = styled.span`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

export const DatesStripe = styled.div`
  display: flex;
  width: 97%;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

export const ArrowButton = styled.button`
  font-size: 1.5rem;
  background: none;
  border-style: none;
  border-radius: 25%;
  height: 45px;
  width: 45px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: red;
    color: blue;
  }
`;

export const Middle = styled.div`
  width: 96%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BackButtonContainer = styled.div`
  width: 20%;
  display: flex;
`;

export const BackButton = styled.button`
  background: #fffe77;
  border-style: none;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #ffffa9;
    font-size: 1.2rem;
  }
`;

export const ActiveDate = styled.span`
  font-size: 2rem;
  background: #006fdd;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  height: 36px;
`;

export const Bottom = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-content: flex-end;
  align-items: flex-end;
  height: 55%;
  margin-bottom: 0.5rem;
`;

export const ReactCalendarContainer = styled.div`
  margin-right: 0.5rem;
`;

export const CalendarIconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CalendarIcon = styled.div`
  cursor: pointer;
  margin-right: 1rem;
`;

// Week
export const WeekWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 160px;
`;

export const DayContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const WeekDay = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const Day = styled.button`
  background: ${(props) =>
    props.today && props.bigger
      ? "#006FDD"
      : props.today
        ? "#FFFE77"
        : props.bigger
          ? "#006FDD"
          : "lightgrey"};
  border-radius: 15%;
  color: ${(props) => (props.bigger ? "white" : "black")};
  height: ${(props) => (props.bigger ? "100px" : "70px")};
  width: ${(props) => (props.bigger ? "100px" : "70px")};
  border-style: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: ${(props) => (props.bigger ? "3.8rem" : "3rem")};
  &:hover {
    background: ${(props) =>
    props.bigger
      ? "#1087ff"
      : !props.today
        ? "rgb(230, 230, 230)"
        : "#ffffa9"};
    color: ${(props) => (props.bigger ? "white" : "black")};
  }
`;
