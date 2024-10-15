import React, { useState } from 'react';
import './Modalpet.css'; // Your existing CSS file for styling
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; // Import dayjs for date management
import 'dayjs/locale/th'; // Import Thai locale from Day.js
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI
import ClearIcon from '@mui/icons-material/Clear'; // Import ClearIcon

const formatToBuddhistEra = (date) => {
    return date ? dayjs(date).year(dayjs(date).year() + 543).format('DD/MM/YYYY') : '';
};

const convertToChristianEra = (date) => {
    return date ? dayjs(date).year(dayjs(date).year() - 543) : null;
};

function AddProfilePet() {
    const [showForm, setShowForm] = useState(false);
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('');
    const [petWeight, setPetWeight] = useState('');
    const [petAge, setPetAge] = useState(dayjs());

    dayjs.locale('th');

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ petName, petType, petWeight, petAge });
    };

    return (
        <div>
            {/* Button to show or hide the form */}
            <button onClick={toggleForm} className="toggle-form-button">
                เพิ่มข้อมูลสัตว์
            </button>

            {/* Modal for the form */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ClearIcon
                            className="close-button"
                            onClick={toggleForm}
                            style={{ cursor: 'pointer', fontSize: '24px', position: 'absolute', top: '10px', right: '10px' }}
                        />
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="petType">ประเภทสัตว์:</label>
                                <select
                                    id="petType"
                                    name="petType"
                                    value={petType}
                                    onChange={(e) => setPetType(e.target.value)}
                                >
                                    <option value="">เลือกประเภท</option>
                                    <option value="สุนัข">สุนัข</option>
                                    <option value="แมว">แมว</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="petName">ชื่อสัตว์เลี้ยง:</label>
                                <input
                                    type="text"
                                    id="petName"
                                    name="petName"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    pattern="[A-Za-zก-๙ ]+"
                                    title="กรุณาใส่เฉพาะตัวอักษร"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="petWeight">น้ำหนัก:</label>
                                <input
                                    type="text"
                                    id="petWeight"
                                    name="petWeight"
                                    value={petWeight}
                                    onChange={(e) => setPetWeight(e.target.value)}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    title="กรุณาใส่เฉพาะตัวเลข"
                                    required
                                />
                            </div>
                            <div className="date-picker">
                                <label htmlFor="petAge">วันเกิดของสัตว์:</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="เลือกวันเกิด"
                                        value={petAge}
                                        onChange={(newValue) => {
                                            setPetAge(convertToChristianEra(newValue));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                helperText={null}
                                                value={formatToBuddhistEra(petAge)}
                                                onChange={() => { }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>
                            {/* Separate button to submit the form */}
                            <button type="submit" className="submit-button">เพิ่มสัตว์เลี้ยง</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddProfilePet;
