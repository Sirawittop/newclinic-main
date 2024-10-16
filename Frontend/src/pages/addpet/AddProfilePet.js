import React, { useState, useEffect } from 'react';
import './Modalpet.css'; // Your existing CSS file for styling
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; // Import dayjs for date management
import 'dayjs/locale/th'; // Import Thai locale from Day.js
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI
import ClearIcon from '@mui/icons-material/Clear'; // Import ClearIcon
import axios from 'axios'; // Import axios for making API requests

// Function to format the date to Buddhist Era
const formatToBuddhistEra = (date) => {
    return date ? dayjs(date).year(dayjs(date).year() + 543).format('DD/MM/YYYY') : '';
};

// Function to calculate age in years, months, and days
const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = dayjs(birthday);
    const today = dayjs();

    // Calculate the difference in years, months, and days
    const years = today.diff(birthDate, 'year');
    const months = today.diff(birthDate.add(years, 'year'), 'month');
    const days = today.diff(birthDate.add(years, 'year').add(months, 'month'), 'day');

    return `${years} ปี ${months} เดือน ${days} วัน`; // Return formatted string
};

// Function to convert the date to Christian Era
const convertToChristianEra = (date) => {
    return date ? dayjs(date).year(dayjs(date).year() - 543) : null;
};

function AddProfilePet() {
    const [showForm, setShowForm] = useState(false);
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('');
    const [petWeight, setPetWeight] = useState('');
    const [petAge, setPetAge] = useState(dayjs());
    const [petProfiles, setPetProfiles] = useState([]); // State to hold pet profiles

    dayjs.locale('th'); // Set the locale for dayjs

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare data to send
        const data = {
            name: petName,
            typepet: petType,
            birthday: convertToChristianEra(petAge).format('YYYY-MM-DD'), // Format date to YYYY-MM-DD for the database
            weight: petWeight,
        };

        try {
            // Make a POST request to your backend API
            const response = await axios.post('http://localhost:8002/api/profilepet', data); // Ensure this URL is correct
            console.log(response.data);

            // Reset form state after successful submission
            setPetName('');
            setPetType('');
            setPetWeight('');
            setPetAge(dayjs());

            // Re-fetch pet profiles to include the new entry
            fetchPetProfiles();
        } catch (error) {
            console.error("There was an error creating the profile pet!", error.response?.data || error.message);
        }
    };

    const fetchPetProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:8002/api/profilepet'); // Ensure this URL is correct
            setPetProfiles(response.data.data); // Set the fetched pet profiles
        } catch (error) {
            console.error("There was an error fetching pet profiles!", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchPetProfiles(); // Fetch pet profiles on component mount
    }, []);

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
                                    required
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
                                            if (newValue) setPetAge(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                helperText={null}
                                                value={formatToBuddhistEra(petAge)}
                                                onChange={() => { }} // Prevent uncontrolled input error
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>
                            {/* Submit button */}
                            <button type="submit" className="submit-button">เพิ่มสัตว์เลี้ยง</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Display fetched pet profiles */}
            <div className="pet-profiles">
                <h2>ข้อมูลสัตว์เลี้ยง</h2>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ชื่อสัตว์เลี้ยง</th>
                            <th>ประเภทสัตว์</th>
                            <th>น้ำหนัก</th>
                            <th>อายุ</th> {/* Updated column for age */}
                            <th>แก้ไขอายุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {petProfiles.map((pet) => (
                            <tr key={pet.id}>
                                <td>{pet.name}</td>
                                <td>{pet.typepet}</td>
                                <td>{pet.weight}</td>
                                <td>{calculateAge(pet.birthday)}</td> {/* Display pet's age */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddProfilePet;
