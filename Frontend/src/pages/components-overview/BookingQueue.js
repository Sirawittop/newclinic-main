import React, { useState, useEffect } from 'react';
import { Container, Typography as MuiTypography } from '@mui/material';
import Calendar4 from './Calendar4'; // Ensure this is the correct path to your Calendar4 component
import './Calendar.css'; // Ensure this is the correct path to your CSS file
import axios from 'axios';

const TypographyPage = () => {
  const [reservedSlots, setReservedSlots] = useState([]);

  // Define the default selected date as September 29, 2024
  const defaultDate = new Date(2024, 8, 29); // 0-indexed months, so 8 represents September

  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/delslottime');
        setReservedSlots(response.data.data);
      } catch (error) {
        console.error('Error fetching reserved slots:', error);
      }
    };

    fetchReservedSlots();
  }, []);

  // Function to format the date to Thai Buddhist Era and Thai language
  const formatDate = (date) => {
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const monthMap = {
      '01': 'มกราคม',
      '02': 'กุมภาพันธ์',
      '03': 'มีนาคม',
      '04': 'เมษายน',
      '05': 'พฤษภาคม',
      '06': 'มิถุนายน',
      '07': 'กรกฎาคม',
      '08': 'สิงหาคม',
      '09': 'กันยายน',
      '10': 'ตุลาคม',
      '11': 'พฤศจิกายน',
      '12': 'ธันวาคม'
    };

    return `${day} ${monthMap[month]} ${year}`; // Return Thai date format
  };

  // This useEffect handles translation of the calendar's days and months to Thai
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
        {/* Pass selectedDate to Calendar4 component */}
        <Calendar4
          timeSlots={[]} // Update this with your actual time slots
          reservedSlots={reservedSlots}
          formatDate={formatDate}
          selectedDate={defaultDate} // Pass September 29, 2024 as the selected date
        />
      </div>
    </Container>
  );
};

export default TypographyPage;
