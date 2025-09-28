const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
// const twilio = require("twilio"); // Abhi Twilio use nahi kar rahe
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// -----------------
// Nodemailer setup
// -----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// -----------------
// Twilio setup (commented for now)
// -----------------
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// -----------------
// Test route
// -----------------
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend is working fine 🚀" });
});

// -----------------
// Contact form route
// -----------------
app.post("/api/contact", async (req, res) => {
  const { name, email, message, language } = req.body;

  try {
    // Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: language === "en" ? 
        `New Contact Form Submission from ${name}` : 
        `नया संपर्क फॉर्म संदेश ${name} से`,
      text: language === "en" ? 
        `Name: ${name}\nEmail: ${email}\nMessage: ${message}` :
        `नाम: ${name}\nईमेल: ${email}\nसंदेश: ${message}`
    });

    // WhatsApp aur SMS temporarily comment kiye gaye
    /*
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: `New Contact Form:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    });
    */

    res.status(200).json({ message: language === "en" ? "Message sent successfully!" : "संदेश सफलतापूर्वक भेजा गया!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: language === "en" ? "Failed to send message" : "संदेश भेजने में विफल" });
  }
});

// -----------------
// Book Havan route
// -----------------
app.post("/api/book-havan", async (req, res) => {
  const { name, phone, havanType, message, language } = req.body;

  try {
    // Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: language === "en" ? 
        `New Havan Booking from ${name}` :
        `नई हवन बुकिंग ${name} से`,
      text: language === "en" ? 
        `Name: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}` :
        `नाम: ${name}\nफ़ोन: ${phone}\nहवन का प्रकार: ${havanType}\nसंदेश: ${message}`
    });

    res.status(200).json({ message: language === "en" ? "Havan booked successfully via email!" : "हवन सफलतापूर्वक बुक हुआ!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: language === "en" ? "Failed to book Havan" : "हवन बुक करने में विफल" });
  }
});

// -----------------
// Start server
// -----------------
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
