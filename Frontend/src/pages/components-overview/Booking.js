import React from 'react';
import './Booking.css';

const Booking = () => {

  


  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th className="headerCell">วันที่</th>
            <th className="headerCell">เวลา</th>
            <th className="headerCell">ชื่อผู้จอง</th>
            <th className="headerCell">เบอร์โทรผู้จอง</th>
            <th className="headerCell">จองมารักษาอะไร</th>
            <th className="headerCell">สถานะดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          <tr className="row">
            <td className="cell"></td>
            <td className="cell"></td>
            <td className="cell"></td>
            <td className="cell"></td>
            <td className="cell"></td>
            <td className="cell"></td>

          </tr>
          {/* เพิ่มแถวและเซลล์ข้อมูลเพิ่มเติมที่นี่ */}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;
