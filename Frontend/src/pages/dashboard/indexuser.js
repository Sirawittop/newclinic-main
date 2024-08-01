import React, { useState } from 'react';
import { Calendar } from 'rsuite';
import { Modal } from 'react-bootstrap';
import 'rsuite/Calendar/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './indexuser.css';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveIcon from '@mui/icons-material/Remove';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timePickers, setTimePickers] = useState([{ open: dayjs('2022-04-17T15:30'), close: dayjs('2022-04-17T15:30') }]);
  const [savedTime] = useState([]);
  //setSavedTime
  function handleDateSelect(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() < today.getTime()) {
      return;
    }
    setSelectedDate(selectedDate);
    setShowModal(true);
  }

  function handleAddIconClick() {
    if (timePickers.length < 3) {
      setTimePickers([...timePickers, { open: dayjs(), close: dayjs() }]);
    }
  }
  function handleClose() {
    setShowModal(false);
  }

  function handleTimeChange(index, type, newValue) {
    const newTimePickers = [...timePickers];
    newTimePickers[index][type] = newValue;
    setTimePickers(newTimePickers);
  }

  function handleDeleteIconClick(index) {
    const newTimePickers = timePickers.filter((_, i) => i !== index);
    setTimePickers(newTimePickers);
  }
  function handleSaveButtonClick() {
    //   if (selectedDate) {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
    //     const selected = new Date(selectedDate);
    //     selected.setHours(0, 0, 0, 0);
    //     if (selected >= today) {
    //       setSavedTime(timePickers);
    //     }
    //   }
    //   setShowModal(false);
    console.log(selectedDate);
  }

  return (
    <div className="main-container">
      <div className="left-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {timePickers.map((timePicker, index) => (
            <div key={index} className="time-picker-container">
              <TimePicker
                label={`เลือกเวลาเปิด ${index + 1}`}
                value={timePicker.open}
                onChange={(newValue) => handleTimeChange(index, 'open', newValue)}
              />
              <TimePicker
                label={`เลือกเวลาปิด ${index + 1}`}
                value={timePicker.close}
                onChange={(newValue) => handleTimeChange(index, 'close', newValue)}
              />
              <button onClick={() => handleDeleteIconClick(index)} type="button" aria-label="buttonRemove" className="buttonRemove">
                <RemoveIcon />
              </button>
            </div>
          ))}
        </LocalizationProvider>
        <button onClick={handleAddIconClick} type="button" aria-label="buttonAdd" className="buttonAdd">
          <AddIcon />
        </button>
        <button onClick={handleSaveButtonClick} type="button" aria-label="buttonSave" className="buttonsave">
          <SaveIcon />
        </button>
      </div>
      <div className="right-container">
        <div className="calendar-wrapper">
          <Calendar bordered onSelect={handleDateSelect} disabledDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ช่วงเวลาที่เปิดให้จองคิว</Modal.Title>
        </Modal.Header>
        <div className="form-container">
          <p>วันที่: {selectedDate ? selectedDate.toLocaleDateString() : ''}</p>
          <ul>
            {selectedDate &&
              savedTime.length > 0 &&
              selectedDate.toLocaleDateString() === new Date().toLocaleDateString() &&
              savedTime.map((time, index) => (
                <li key={index}>{`ช่วงที่ ${index + 1}: ${time.open.format('HH:mm')} - ${time.close.format('HH:mm')}`}</li>
              ))}
          </ul>
        </div>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}
