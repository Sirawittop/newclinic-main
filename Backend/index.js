const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const app = express();

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

const port = 8000;
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
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // สร้าง token jwt
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
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
  console.log("Server started at port 8000");
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
  const { name, phone, email, date, time, type,status } = req.body;
  try {
    const [results] = await conn.query(
      "INSERT INTO reservationqueue (name, numphone, email, dataday, time, reservation_type,status_id) VALUES (?, ?, ?, ?, ?, ? ,?)",
      [name, phone, email, date, time, type, status]
    );

    // Send confirmation email
    const subject = "Booking Confirmation";
    const text = `🏥 การยืนยันการจองคิวคลินิก 🏥

สวัสดีคุณ ${name} 👋

เรายินดีที่จะแจ้งให้ทราบว่าการจองของคุณได้รับการยืนยันเรียบร้อยแล้ว

📅 วันที่: ${formatDate(date)}
🕒 เวลา: ${time}
🩺 ประเภทการรักษา: ${type}

⏰ โปรดมาถึงคลินิกก่อนเวลานัดหมาย 10 นาที

🔔 ข้อควรจำ:
- หากต้องการยกเลิกคิวจอง กรุณากดยกเลิกในระบบก่อนเวลานัด 24 ชั่วโมง

🙏 ขอบคุณที่เลือกใช้บริการคลินิกของเรา
เราหวังว่าคุณจะได้รับประสบการณ์ที่ดีในการรักษา

หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ที่ 📞 054 073 883 หรือ 093 694 4451
`;
    sendEmail(email, subject, text);

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
      `SELECT DATE_FORMAT(dataday, '%Y-%m-%d') AS date, time, reservation_type 
       FROM reservationqueue 
       WHERE email = ?`,
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

// make api sent email for reset password
app.post("/api/forgotpassword", async (req, res) => {

  console.log("req.body");

  const { email } = req.body;
  try {
    const [results] = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    if (results.length === 0) {
      return res.status(400).send({ message: "Email not found" });
    }

    const subject = "Reset Password";
    const text = `🔒 การรีเซ็ตรหัสผ่าน 🔒

สวัสดีคุณ ${results[0].name} 👋

คุณสามารถกดลิงค์ด้านล่างเพื่อรีเซ็ตรหัสผ่านของคุณ

🔗 http://localhost:3000/resetpassword/${results[0].email
      .split("@")
      .join("%40")}
}
`;
    sendEmail(email, subject, text);

    res.json({
      message: "Email sent successfully",
    });
  }
  catch (error) {
    console.log("error", error);
    res.status(403).json({
      message: "Email sent failed",
      error,
    });
  }
}
);