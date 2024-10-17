const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const app = express();
const cron = require('node-cron');
const crypto = require('crypto');
const cronJob = require('node-cron');



app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "clinicbannsansuk@gmail.com",
    pass: "oepn dsbt osfk qvwt",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "clinicbannsansuk@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return;
    }
  });
};

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = d.getFullYear();

  return `${day}/${month}/${year + 543}`;
};

const port = 8002;
const secret = "mysecret";

let conn = null;

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "AnimalClinic",
  });
};

app.post("/api/register", async (req, res) => {
  const { name, numphone, email, password } = req.body;

  const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", email);
  if (rows.length) {
    return res.status(400).send({ message: "Email is already registered" });
  }

  // Hash the password
  const hash = await bcrypt.hash(password, 10);

  const userData = {
    name,
    numphone,
    email,
    password: hash,
    role: 1,
  };

  try {
    const result = await conn.query("INSERT INTO users SET ?", userData);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "insert fail",
      error,
    });
  }

  res.status(201).send({ message: "User registered successfully" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await conn.query(
      "SELECT * from users WHERE email = ?",
      email
    );

    if (result.length === 0) {
      return res.status(400).send({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง token jwt
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
      userRole: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);

    const [checkResults] = await conn.query(
      "SELECT * FROM users where email = ?",
      user.email
    );

    if (!checkResults[0]) {
      throw { message: "user not found" };
    }

    const [results] = await conn.query("SELECT * FROM users");
    res.json({
      users: results,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Authention fail",
      error,
    });
  }
});

app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const [results] = await conn.query("SELECT * FROM users WHERE id = ?", id);
  res.json({ user: results[0] });
});

// Listen
app.listen(port, async () => {
  await initMySQL();
  console.log("Server started at port 8002");
});

// make api to get data from database
app.get("/api/users", async (req, res) => {
  const [results] = await conn.query("SELECT * FROM users");
  res.json({ clinic: results });
});

// get only user that login with token
app.get("/api/usertoken", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);

    const [checkResults] = await conn.query(
      "SELECT * FROM users where email = ?",
      user.email
    );

    if (!checkResults[0]) {
      throw { message: "user not found" };
    }

    const [results] = await conn.query(
      "SELECT name , numphone , email , role FROM users where email = ?",
      user.email
    );
    res.json({
      users: results,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Authention fail",
      error,
    });
  }
});

// edit profile
app.put("/api/editprofile", async (req, res) => {
  const { name, email, numphone } = req.body;
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);

    const [checkResults] = await conn.query(
      "SELECT * FROM users where email = ?",
      user.email
    );

    if (!checkResults[0]) {
      throw { message: "user not found" };
    }

    const [results] = await conn.query(
      "UPDATE users SET name = ? , email = ? , numphone = ? WHERE email = ?",
      [name, email, numphone, user.email]
    );
    res.json({
      message: "edit profile success",
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Authention fail",
      error,
    });
  }
});

// edit password
app.put("/api/editpassword", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);

    const [checkResults] = await conn.query(
      "SELECT * FROM users where email = ?",
      user.email
    );

    if (!checkResults[0]) {
      throw { message: "user not found" };
    }

    const match = await bcrypt.compare(
      currentPassword,
      checkResults[0].password
    );

    if (!match) {
      return res.status(400).send({ message: "Invalid current password" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const [results] = await conn.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hash, user.email]
    );
    res.json({
      message: "edit password success",
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Authention fail",
      error,
    });
  }
});
// post api for booking time


app.post("/api/booking", async (req, res) => {
  const { name, phone, email, date, time, type, symptoms, petName } = req.body;

  // Function to format date without time fractions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Function to format time without fractional seconds
  function formatTime(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }


  try {
    // Insert into the database
    const [results] = await conn.query(
      "INSERT INTO reservationqueue (name, numphone, email, dataday, time, reservation_type, status,symptom, namepet) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)",
      [name, phone, email, date, time, type, 1, symptoms, petName]
    );

    // Email content
    const subject = "ยืนยันการจองคิว";
    const text = `🏥 การยืนยันการจองคิวคลินิก 🏥

สวัสดีคุณ ${name} 👋

เรายินดีที่จะแจ้งให้ทราบว่าการจองของคุณได้รับการยืนยันเรียบร้อยแล้ว

📅 วันที่: ${formatDate(date)}
🕒 เวลา: ${formatTime(time)}
🩺 ประเภทการรักษา: ${type}

⏰ โปรดมาถึงคลินิกก่อนเวลานัดหมาย 10 นาที

🔔 ข้อควรจำ:
- 1คิวจองต่อสัตว์1ตัวครับ
- หากต้องการยกเลิกคิวจอง กรุณากดยกเลิกในระบบก่อนเวลานัดอย่างน้อย 4 ชั่วโมง
- ถ้าใกล้ถึงเวลาจองจะมีอีเมลมาเตือนความจำท่านอีกครั้ง

🙏 ขอบคุณที่เลือกใช้บริการคลินิกของเรา
เราหวังว่าคุณจะได้รับประสบการณ์ที่ดีในการรักษา

หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ที่ 📞 054 073 883 หรือ 093 694 4451
`;

    // Send confirmation email
    sendEmail(email, subject, text);

    // Respond with success message
    res.json({
      message: "Booking successful and confirmation email sent",
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Booking failed",
      error,
    });
  }
});

app.get("/api/delslottime", async (req, res) => {
  try {
    const [results] = await conn.query(
      "SELECT DATE_FORMAT(dataday, '%c/%d/%Y') AS dataday, TIME_FORMAT(time, '%H:%i') AS time FROM reservationqueue"
    );
    res.json({
      message: "search time slot success",
      data: results,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "search time slot failed",
      error,
    });
  }
});

app.get('/api/historybooking', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
      return res.status(401).json({ message: 'Token missing' });
    }

    let user;
    try {
      user = jwt.verify(authToken, secret);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error });
    }

    const [results] = await conn.query(
      `SELECT id, DATE_FORMAT(dataday, '%Y-%m-%d') AS date, time, reservation_type, status, doctordescription, symptom, namepet
       FROM reservationqueue 
       WHERE email = ?
       ORDER BY id DESC`,  // Sorting by dataday in descending order
      [user.email]
    );
    res.json({
      message: 'Search history booking success',
      data: results,
    });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'Search history booking failed',
      error,
    });
  }
});

app.post("/api/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const [results] = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(400).send({ message: "Email not found" });
    }

    // Generate a unique token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Update the user's record with the reset token and expiry
    await conn.query(
      "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
      [resetToken, resetTokenExpiry, email]
    );

    const resetLink = `http://localhost:3000/AnimalClinic/Forgotpass?token=${resetToken}`;

    const subject = "Reset Password";
    const text = `🔒 การรีเซ็ตรหัสผ่าน 🔒

สวัสดีคุณ ${results[0].name} 👋

คุณสามารถกดลิงค์ด้านล่างเพื่อรีเซ็ตรหัสผ่านของคุณ

🔗 ${resetLink}

ลิงค์นี้จะหมดอายุใน 1 ชั่วโมง

หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาละเว้นอีเมลนี้
`;

    await sendEmail(email, subject, text);

    res.json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Email sent failed",
      error: error.message,
    });
  }
});

// New endpoint to handle password reset
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const [results] = await conn.query(
      "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > ?",
      [token, Date.now()]
    );

    if (results.length === 0) {
      return res.status(400).send({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await conn.query(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?",
      [hashedPassword, results[0].id]
    );

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
});

// make api to get data from database
app.get("/api/userRole", async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const authToken = authHeader.split(' ')[1];
  if (!authToken) {
    return res.status(401).json({ message: 'Token missing' });
  }

  let user;
  try {
    user = jwt.verify(authToken, secret);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error });
  }


  try {
    const [results] = await conn.query("SELECT role FROM users WHERE email = ?", [user.email]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ role: results[0].role });
  } catch (error) {
    res.status(500).json({ message: 'Database query failed', error });
  }


  app.get("/api/queuebooking", async (req, res) => {
    const { name, phone, email, date, time, type } = req.body;
    try {
      const [] = await conn.query(
        "INSERT INTO reservationqueue (name, numphone, email, dataday, time, reservation_type) VALUES (?, ?,  ?, ?, ? ,?)",
        [name, phone, email, date, time, type]
      );
    } catch (error) {
      console.log("error", error);
      res.status(403).json({
        message: "Booking failed",
        error,
      });
    }
  }
  );
});






app.get('/api/queuedoctor', async (req, res) => {
  const { targetDate } = req.query; // Extract targetDate from query parameters

  if (!targetDate) {
    return res.status(400).json({
      message: "Target date is required",
    });
  }

  // Optional: Validate the date format if needed
  // For example, using a regex to check the format YYYY-MM-DD
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(targetDate)) {
    return res.status(400).json({
      message: "Invalid date format. Expected format is YYYY-MM-DD",
    });
  }

  try {
    const [results] = await conn.query(
      `SELECT * FROM reservationqueue 
       WHERE DATE(dataday) = ? 
         AND name IS NOT NULL 
         AND numphone IS NOT NULL 
         AND email IS NOT NULL`,
      [targetDate]
    );
    res.json({
      message: "Search queue booking success",
      data: results,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(403).json({
      message: "Search queue booking failed",
      error,
    });
  }

});

app.post('/api/doctordescription', async (req, res) => {
  const { id, doctordescription } = req.body;

  try {
    const [results] = await conn.query(
      `UPDATE reservationqueue 
       SET status = 2, doctordescription = ?
       WHERE id = ?`,
      [doctordescription, id] // Correct order of values
    );
    res.json({
      message: "Cancel queue booking success",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(403).json({
      message: "Cancel queue booking failed",
      error,
    });
  }
});


app.delete("/api/cancelbooking/:id", async (req, res) => {
  const { id } = req.params; // Extracting `id` from req.params
  try {
    // Check if the booking exists
    const [booking] = await conn.query(
      "SELECT id FROM reservationqueue WHERE id = ?",
      [id]
    );

    if (!booking || booking.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Delete the booking
    const [results] = await conn.query(
      "DELETE FROM reservationqueue WHERE id = ?",
      [id]
    );

    res.json({
      message: "Cancel queue booking success",
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      message: "Cancel queue booking failed",
      error: error.message,
    });
  }
});

const updateStatusEveryMinute = async () => {
  conn = await initMySQL(); // Initialize the connection

  cron.schedule('* * * * *', async () => { // This will run every minute
    try {
      if (!conn) {
        console.error('MySQL connection is not initialized.');
        return;
      }

      // Get the current date
      const now = new Date();

      // Calculate the date 1 day ago (to check dates properly)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Format the date to 'YYYY-MM-DD'
      const formattedDate = oneDayAgo.toISOString().slice(0, 10);

      // Perform the update query
      const [results] = await conn.query(
        `UPDATE reservationqueue 
         SET status = 3
         WHERE DATE(dataday) < ? AND status = 1`,
        [formattedDate]
      );

    } catch (error) {
      console.log('Error in scheduled task:', error);
    }
  });
};

updateStatusEveryMinute();


app.delete("/api/vetcancelbooking/:id", async (req, res) => {
  const { id } = req.params; // Extracting `id` from req.params
  try {
    // Check if the booking exists
    const [booking] = await conn.query(
      "SELECT id, name, email, dataday, time, reservation_type FROM reservationqueue WHERE id = ?",
      [id]
    );

    if (!booking || booking.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const { name, email, dataday, time, reservation_type } = booking[0];

    // Delete the booking
    await conn.query("DELETE FROM reservationqueue WHERE id = ?", [id]);

    // Send cancellation email using the existing sendEmail function
    const subject = "แจ้งยกเลิกการจองคิวคลินิกบ้านแสนสุข";
    const text = `สวัสดีคุณ ${name}, 

การจองของคุณสำหรับวันที่ ${formatDate(dataday)} เวลา ${time} ประเภทการรักษา ${reservation_type} ถูกยกเลิกเรียบร้อยแล้ว

ขออภัยในความไม่สะดวก หากต้องการจองใหม่ โปรดเข้าสู่ระบบเว็บไซต์ของเรา

หากมีคำถามเพิ่มเติม โปรดติดต่อเราได้ที่ 📞 054 073 883 หรือ 093 694 4451


คลินิกบ้านแสนสุข`;

    sendEmail(email, subject, text);

    res.json({
      message: "Cancel queue booking success, cancellation email sent",
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      message: "Cancel queue booking failed",
      error: error.message,
    });
  }
});

app.post("/api/doctordescriptionandReservation", async (req, res) => {
  const { id, doctordescription, formData } = req.body;

  try {
    // Update the reservationqueue with the doctor description
    const [updateResult] = await conn.query(
      `UPDATE reservationqueue SET status = 2, doctordescription = ? WHERE id = ?`,
      [doctordescription, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Fetch the name, numphone, and email from reservationqueue
    const [reservation] = await conn.query(
      `SELECT name, numphone, email FROM reservationqueue WHERE id = ?`,
      [id]
    );

    if (reservation.length === 0) {
      return res.status(404).json({ message: "Reservation details not found" });
    }

    const { name, numphone, email } = reservation[0];

    // Convert date and add one day
    const date = new Date(formData.date);
    date.setDate(date.getDate() + 1);
    const formattedDate = date.toISOString().split('T')[0];

    // Insert a new record into reservationqueue
    const [insertResult] = await conn.query(
      `INSERT INTO reservationqueue (name, numphone, email, dataday, time, reservation_type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, numphone, email, formattedDate, formData.time, formData.appointmentType, 1]
    );

    // Format email content
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    function formatTime(timeString) {
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // send email 
    const subject = "แจ้งวันนัดหมายคลินิก";
    const text = `🏥 แจ้งวันนัดหมายคลินิก 🏥
 
    สวัสดีคุณ ${name} 👋
 
    เรายินดีที่จะแจ้งให้ทราบว่าคุณได้นัดหมายคิวครั้งถัดไปให้เรียบร้อยแล้ว
 
    📅 วันที่: ${formatDate(formattedDate)}
    🕒 เวลา: ${formatTime(formData.time)}
    🩺 ประเภทการรักษา: ${formData.appointmentType}
 
    ⏰ โปรดมาถึงคลินิกก่อนเวลานัดหมาย 10 นาที
 
    🔔 ข้อควรจำ:
   - 1คิวจองต่อสัตว์1ตัวครับ
- หากต้องการยกเลิกคิวจอง กรุณากดยกเลิกในระบบก่อนเวลานัดอย่างน้อย 4 ชั่วโมง
- ถ้าใกล้ถึงเวลาจองจะมีอีเมลมาเตือนความจำท่านอีกครั้ง
 
    🙏 ขอบคุณที่เลือกใช้บริการคลินิกของเรา`;

    // Send confirmation email
    sendEmail(email, subject, text);

    res.json({ message: "Doctor description and reservation success" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Doctor description failed", error });
  }
});

const moment = require('moment');

// Array to keep track of sent reminders
const sentReminders = new Set();

// Function to get appointments within the next 24 hours
const getUpcomingAppointments = async () => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss'); // Current time
  const next24Hours = moment().add(6, 'hours').format('YYYY-MM-DD HH:mm:ss'); // 24 hours from now

  const query = `
    SELECT id, name, email, dataday, time, reservation_type 
    FROM reservationqueue
    WHERE CONCAT(dataday, ' ', time) BETWEEN ? AND ?
  `;

  // Use connection to fetch data from the database
  const [rows] = await conn.execute(query, [currentTime, next24Hours]);
  return rows;
};

// Function to send reminder emails
const sendReminderEmails = async () => {
  try {
    const appointments = await getUpcomingAppointments();

    for (const appointment of appointments) {
      const appointmentKey = `${appointment.dataday} ${appointment.time}`;

      // Check if the reminder has already been sent for this appointment
      if (sentReminders.has(appointmentKey)) {
        continue; // Skip if already notified
      }

      const subject = "แจ้งเตือนล่วงหน้าวันนัดหมายคลินิก";
      const text = `🏥 แจ้งเตือนวันนัดหมายคลินิก 🏥

      สวัสดีคุณ ${appointment.name} 👋

      เราขอแจ้งเตือนว่าวันนัดหมายของคุณกำลังจะมาถึง

      📅 วันที่: ${moment(appointment.dataday).format('DD/MM/YYYY')}
      🕒 เวลา: ${moment(appointment.time, 'HH:mm:ss').format('HH:mm')} น.
      🩺 ประเภทการรักษา: ${appointment.reservation_type}

      ⏰ โปรดมาถึงคลินิกก่อนเวลานัดหมาย 10 นาที
- 1คิวจองต่อสัตว์1ตัวครับ
- หากต้องการยกเลิกคิวจอง กรุณากดยกเลิกในระบบก่อนเวลานัดอย่างน้อย 4 ชั่วโมง


      🙏 ขอบคุณที่เลือกใช้บริการคลินิกของเรา`;

      try {
        await new Promise((resolve, reject) => {
          sendEmail(appointment.email, subject, text, (error, info) => {
            if (error) {
              reject(error);
            } else {
              resolve(info);
            }
          });
        });
        console.log(`Reminder sent to ${appointment.email}`);
        // Mark this appointment as notified
        sentReminders.add(appointmentKey);
      } catch (error) {
        console.error(`Failed to send reminder to ${appointment.email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error sending reminder emails:", error);
  }
};

// Set an interval to send reminders every hour
setInterval(() => {
  sendReminderEmails();
}, 7200000); // 7200000 milliseconds = 2 hours


// post api for profilepet
app.post("/api/profilepet", async (req, res) => {
  const { name, typepet, birthday, weight } = req.body; // Fixed 'weitht' to 'weight'

  try {
    const [result] = await conn.query(
      "INSERT INTO profilepet (name, typepet, birthday, weight) VALUES (?, ?, ?, ?)",
      [name, typepet, birthday, weight]
    );

    // Respond with a success message
    res.status(201).json({
      message: "Profile pet created successfully",
      data: result, // Optionally return the result of the insert
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Booking failed",
      error,
    });
  }
});


// select * from profilepet
app.get("/api/Profilepet", async (req, res) => {
  try {
    const [results] = await conn.query("SELECT * FROM profilepet");
    res.json({
      message: "Search profile pet success",
      data: results,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Search profile pet failed",
      error,
    });
  }
});

app.put("/api/profilepet/weight/:id", async (req, res) => {
  const { id } = req.params;
  const { weight } = req.body; // รับค่า weight จาก body


  try {
    const [result] = await conn.query(
      "UPDATE profilepet SET weight = ? WHERE id = ?",
      [weight, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: "Weight updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Profile pet not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Error updating weight",
      error,
    });
  }
});


app.get("/api/namepet", async (req, res) => {
  try {
    const [results] = await conn.query("SELECT name FROM profilepet");
    res.json({
      message: "Search profile pet success",
      data: results,
    });
  } catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Search profile pet failed",
      error,
    });
  }
});
