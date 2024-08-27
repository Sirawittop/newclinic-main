import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import 'moment/locale/th';
import { EventCalendar } from 'react-mui-event-calendar';
import './HomePageAdmin.css';

const BookingModal = ({ booking, setFormVisible, setFormText, formText, handleFormSubmit, isFormVisible }) => {
  // Log for debugging
  useEffect(() => {
    console.log('formText in BookingModal:', formText);
  }, [formText]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setFormText(event.target.value);
  };

  return (
    <div>
      <div className="table">
        <div className="header">ชื่อผู้จอง</div>
        <div className="content">{booking.name}</div>
        <div className="header">เบอร์โทรศัพท์</div>
        <div className="content">{booking.phone}</div>
        <div className="header">วันที่จอง</div>
        <div className="content">{booking.date}</div>
        <div className="header">เวลาจอง</div>
        <div className="content">{booking.time}</div>
        <div className="header">จองคิวรักษาอะไร</div>
        <div className="content">{booking.serviceType}</div>
        <div className="header">สถานะดำเนินการ</div>
        <div className="content">{booking.status}</div>
        <div className="header">หมายเหตุ</div>
        <textarea
          value={formText}
          onChange={handleChange}
          placeholder="ใส่หมายเหตุที่นี่..." // This is Thai for "Enter a note here..."
        />
      </div>

      {isFormVisible && (
        <div className="form-modal">
          <textarea
            value={formText}
            onChange={(e) => {
              console.log('Form modal onChange:', e.target.value); // Log onChange value
              setFormText(e.target.value);
            }}
            placeholder="Enter your notes here..."
          />
          <button onClick={handleFormSubmit}>Submit</button>
          <button onClick={() => setFormVisible(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

function App() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [formText, setFormText] = useState('');
  const [dataSource, setDataSource] = useState([
    {
      date: new Date(),
      title: 'คิวจอง',
      popupContent: (
        <BookingModal
          booking={{
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            serviceType: 'บริการตัวอย่าง',
            status: 'กำลังดำเนินการ',
            name: 'John Doe',
            phone: '123456789'
          }}
          setFormVisible={setFormVisible}
          setFormText={setFormText}
          formText={formText}
          handleFormSubmit={() => {
            console.log('Form submitted:', formText);
            setFormVisible(false);
          }}
          isFormVisible={isFormVisible}
        />
      ),
      id: '1'
    }
    // ...other data entries
  ]);
  const [openModals, setOpenModals] = useState({});

  useEffect(() => {
    document
      .querySelectorAll('.MuiTypography-root.MuiTypography-caption.MuiTypography-gutterBottom.css-1x4sxjj-MuiTypography-root')
      .forEach((el) => {
        if (el.innerText === 'FRI.') {
          el.innerText = 'ศุกร์';
        }
      });
  }, []);

  const handleOpen = (id) => {
    setOpenModals((prev) => ({ ...prev, [id]: true }));
  };

  const handleClose = (id) => {
    setOpenModals((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto'
      }}
    >
      <EventCalendar
        dataSource={dataSource}
        pallet={{ primary: '#d2140a', secondary: '#dc4a41' }}
        onDataChange={(newEvents) => setDataSource(newEvents)}
        onEventClick={(event) => handleOpen(event.id)}
        locale="th"
        weekStartsOn={0}
        dayNames={['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']}
      />

      {dataSource.map((event) => (
        <Dialog
          key={event.id}
          open={!!openModals[event.id]}
          onClose={() => handleClose(event.id)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Event Details'}</DialogTitle>
          <DialogContent>{event.popupContent}</DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      ))}
    </div>
  );
}

export default App;
