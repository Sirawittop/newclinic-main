import React, { useState, useEffect } from 'react';
import { Container, Typography as MuiTypography } from '@mui/material';
import Calendar4 from './Calendar4'; // Ensure this is the correct path to your Calendar4 component
import './Calendar.css'; // Ensure this is the correct path to your CSS file
import axios from 'axios';

const TypographyPage = () => {
  const [reservedSlots, setReservedSlots] = useState([]);

  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/delslottime');
        setReservedSlots(response.data.data);
      } catch (error) {
        console.error('Error fetching reserved slots:', error);
      }
    };

    fetchReservedSlots();
  }, []);

  const timeSlots = {
    // Time slot definitions...
  };

  useEffect(() => {
    const dayMap = {
      'Mon': 'จันทร์',
      'Tue': 'อังคาร',
      'Wed': 'พุธ',
      'Thu': 'พฤหัสบดี',
      'Fri': 'ศุกร์',
      'Sat': 'เสาร์',
      'Sun': 'อาทิตย์'
    };

    const monthMap = {
      'Jan': 'ม.ค.',
      'Feb': 'ก.พ.',
      'Mar': 'มี.ค.',
      'Apr': 'เม.ย.',
      'May': 'พ.ค.',
      'Jun': 'มิ.ย.',
      'Jul': 'ก.ค.',
      'Aug': 'ส.ค.',
      'Sep': 'ก.ย.',
      'Oct': 'ต.ค.',
      'Nov': 'พ.ย.',
      'Dec': 'ธ.ค.'
    };

    const translateNames = () => {
      // Translate day names
      document.querySelectorAll('.datepicker-day-label').forEach(element => {
        const englishDay = element.textContent.trim();
        if (dayMap[englishDay]) {
          element.textContent = dayMap[englishDay];
        }
      });

      // Translate month abbreviations
      document.querySelectorAll('.scroll-head').forEach(element => {
        const englishMonth = element.textContent.trim();
        if (monthMap[englishMonth]) {
          element.textContent = monthMap[englishMonth];
        }
      });
    };

    const observer = new MutationObserver(() => {
      translateNames();
    });

    // Start observing the calendar container for changes
    const calendarContainer = document.querySelector('.main-container');
    if (calendarContainer) {
      observer.observe(calendarContainer, { childList: true, subtree: true });
    }

    // Ensure initial translation after component mounts
    translateNames();

    // Cleanup the observer on component unmount
    return () => {
      if (calendarContainer) {
        observer.disconnect();
      }
    };
  }, []);

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

export default TypographyPage;
