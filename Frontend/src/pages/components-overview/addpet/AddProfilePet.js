import React, { useState } from 'react'; // Import React and useState
import './Modalpet.css'; // Your existing CSS file for styling
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; // Import dayjs for date management

function AddProfilePet() {
    const [showForm, setShowForm] = useState(false);
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('');
    const [petWeight, setPetWeight] = useState('');
    const [petAge, setPetAge] = useState(dayjs()); // Initialize with current date

    // ฟังก์ชันสำหรับแสดงหรือซ่อนฟอร์ม
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission (e.g., send data to your backend)
        console.log({ petName, petType, petWeight, petAge });
    };

    return (
        <div>
            {/* ปุ่มที่สามารถกดได้ */}
            <button onClick={toggleForm}>
                {showForm ? 'ซ่อนฟอร์ม' : 'แสดงฟอร์ม'}
            </button>

            {/* Modal สำหรับฟอร์ม */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={toggleForm}>✖</button>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="petName">ชื่อสัตว์เลี้ยง:</label>
                                <input
                                    type="text"
                                    id="petName"
                                    name="petName"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="petType">ประเภทสัตว์:</label>
                                <input
                                    type="text"
                                    id="petType"
                                    name="petType"
                                    value={petType}
                                    onChange={(e) => setPetType(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="petWeight">น้ำหนัก:</label>
                                <input
                                    type="number"
                                    id="petWeight"
                                    name="petWeight"
                                    value={petWeight}
                                    onChange={(e) => setPetWeight(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="petAge">อายุสัตว์:</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="เลือกวันเกิด"
                                        value={petAge}
                                        onChange={(newValue) => setPetAge(newValue)}
                                    />
                                </LocalizationProvider>
                            </div>
                            <button type="submit">เพิ่มสัตว์เลี้ยง</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddProfilePet;
