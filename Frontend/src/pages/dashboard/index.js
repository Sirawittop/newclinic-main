import React, { useState, useEffect } from 'react';
import { Container, Typography as MuiTypography } from '@mui/material';
import Calendar4 from './timemanagevet';
import './timemanagevet.css';
import axios from 'axios';

const Index = () => {
  const [reservedSlots, setReservedSlots] = useState([]);

  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        axios
          .get('http://localhost:8000/api/delslottime')
          .then((response) => {
            setReservedSlots(response.data.data);
          })
          .catch((error) => {
            console.error('Error fetching reserved slots:', error);
          });
      } catch (error) {
        console.error('Failed to fetch reserved slots', error);
      }
    };

    fetchReservedSlots();
  }, []);

  const timeSlots = {
    Monday: [
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
      '18:30 - 19:00'
    ],
    Tuesday: [
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
      '18:30 - 19:00'
    ],
    Wednesday: 'วันนี้ร้านปิดค่ะ คุณสามารถจองคิวได้ในวันอื่นได้ค่ะ',
    Thursday: [
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
      '18:30 - 19:00'
    ],
    Friday: [
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
      '18:30 - 19:00'
    ],
    Saturday: [
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
      '18:30 - 19:00'
    ],
    Sunday: 'วันนี้ร้านปิดค่ะ คุณสามารถจองคิวได้ในวันอื่นได้ค่ะ'
  };

  return (
    <Container maxWidth="md">
      <MuiTypography variant="h3" align="center" gutterBottom>
        จองคิวรักษาสัตว์
      </MuiTypography>
      <div className="main-container">
        <Calendar4 timeSlots={timeSlots} reservedSlots={reservedSlots} />
      </div>
    </Container>
  );
};

export default Index;
