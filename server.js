const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Check env variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env file");
  process.exit(1);
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test transporter connection (optional)
transporter.verify((error, success) => {
  if (error) {
    console.error("Mail connection error:", error);
  } else {
    console.log("Mail server ready to send messages ✅");
  }
});

// Contact form route
app.post("/api/contact", async (req, res) => {
  const { name, email, message, language } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const subject =
      language === "hi"
        ? `नई संपर्क फ़ॉर्म सबमिशन - ${name}`
        : `New Contact Form Submission from ${name}`;
    const text =
      language === "hi"
        ? `नाम: ${name}\nईमेल: ${email}\nसंदेश: ${message}`
        : `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject,
      text,
    });

    res.status(200).json({
      message:
        language === "hi"
          ? "संदेश सफलतापूर्वक भेजा गया!"
          : "Message sent successfully!",
    });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({
      error:
        language === "hi"
          ? "संदेश भेजने में त्रुटि हुई।"
          : "Failed to send message",
    });
  }
});

// Havan booking route
app.post("/api/book-havan", async (req, res) => {
  const { name, phone, havanType, message, language } = req.body;

  if (!name || !phone || !havanType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const subject =
      language === "hi"
        ? `नई हवन बुकिंग - ${name}`
        : `New Havan Booking from ${name}`;
    const text =
      language === "hi"
        ? `नाम: ${name}\nफोन: ${phone}\nहवन का प्रकार: ${havanType}\nसंदेश: ${message}`
        : `Name: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}`;

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject,
      text,
    });

    res.status(200).json({
      message:
        language === "hi"
          ? "हवन सफलतापूर्वक बुक हो गया!"
          : "Havan booked successfully!",
    });
  } catch (err) {
    console.error("Havan booking email failed:", err);
    res.status(500).json({
      error:
        language === "hi"
          ? "हवन बुकिंग में त्रुटि हुई।"
          : "Failed to book Havan",
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
