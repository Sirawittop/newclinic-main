import React, { useState, useEffect } from 'react';
import './Modalpet.css'; // Your existing CSS file for styling
import ClearIcon from '@mui/icons-material/Clear'; // Import ClearIcon
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import axios from 'axios'; // Import axios for making API requests
import dayjs from 'dayjs'; // Import dayjs for date management
import 'dayjs/locale/th'; // Import Thai locale from Day.js

const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = dayjs(birthday);
    const today = dayjs();
    const years = today.diff(birthDate, 'year');
    const months = today.diff(birthDate.add(years, 'year'), 'month');
    const days = today.diff(birthDate.add(years, 'year').add(months, 'month'), 'day');
    return `${years} ปี ${months} เดือน ${days} วัน`;
};

function AddProfilePet() {
    const [showForm, setShowForm] = useState(false);
    const [petName, setPetName] = useState('');
    const [petType, setPetType] = useState('');
    const [petWeight, setPetWeight] = useState('');
    const [petAge, setPetAge] = useState(dayjs());
    const [petProfiles, setPetProfiles] = useState([]);

    // New state for editing weight
    const [editPopup, setEditPopup] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [newWeight, setNewWeight] = useState('');

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            name: petName,
            typepet: petType,
            birthday: petAge.format('YYYY-MM-DD'), // Keep the birthday
            weight: petWeight,
        };

        try {
            const response = await axios.post('http://localhost:8002/api/profilepet', data);
            console.log(response.data);
            setPetName('');
            setPetType('');
            setPetWeight('');
            setPetAge(dayjs());
            fetchPetProfiles();
        } catch (error) {
            console.error("There was an error creating the profile pet!", error.response?.data || error.message);
        }
    };

    const fetchPetProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:8002/api/profilepet');
            setPetProfiles(response.data.data);
        } catch (error) {
            console.error("There was an error fetching pet profiles!", error.response?.data || error.message);
        }
    };

    // New function to handle the edit click
    const handleEditClick = (pet) => {
        setSelectedPet(pet);
        setNewWeight(pet.weight); // Set the current weight of the pet in the input
        setEditPopup(true); // Show the edit popup
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const updatedData = {
            ...selectedPet,
            weight: newWeight,
        };

        try {
            await axios.put(`http://localhost:8002/api/profilepet/${selectedPet.id}`, updatedData); // Update request
            fetchPetProfiles(); // Refresh pet profiles
            setEditPopup(false); // Hide popup after submission
        } catch (error) {
            console.error("There was an error updating the pet's weight!", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchPetProfiles();
    }, []);

    return (
        <div>
            <button onClick={toggleForm} className="toggle-form-button">
                เพิ่มข้อมูลสัตว์
            </button>

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
                            <div>
                                <label htmlFor="petAge">วันเกิดของสัตว์:</label>
                                <input
                                    type="date"
                                    id="petAge"
                                    value={petAge.format('YYYY-MM-DD')}
                                    onChange={(e) => setPetAge(dayjs(e.target.value))}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">เพิ่มสัตว์เลี้ยง</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Weight Popup */}
            {editPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ClearIcon
                            className="close-button"
                            onClick={() => setEditPopup(false)}
                            style={{ cursor: 'pointer', fontSize: '24px', position: 'absolute', top: '10px', right: '10px' }}
                        />
                        <h2>แก้ไขน้ำหนักสัตว์</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label htmlFor="newWeight">น้ำหนักสัตว์:</label>
                                <input
                                    type="text"
                                    id="newWeight"
                                    value={newWeight}
                                    onChange={(e) => setNewWeight(e.target.value)}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    title="กรุณาใส่เฉพาะตัวเลข"
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">บันทึก</button>
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
                            <th>อายุ</th>
                            <th>แก้ไขน้ำหนัก</th>
                        </tr>
                    </thead>
                    <tbody>
                        {petProfiles.map((pet) => (
                            <tr key={pet.id}>
                                <td>{pet.name}</td>
                                <td>{pet.typepet}</td>
                                <td>{pet.weight}</td>
                                <td>{calculateAge(pet.birthday)}</td>
                                <td>
                                    <EditIcon style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleEditClick(pet)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddProfilePet;
