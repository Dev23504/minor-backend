const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
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
// Twilio setup
// -----------------
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// -----------------
// Contact form route
// -----------------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,  // खुद को भेजो
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    // WhatsApp
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: `New Contact Form:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    // SMS
    await client.messages.create({
      from: process.env.TWILIO_SMS_NUMBER,
      to: process.env.MY_PHONE_NUMBER,
      body: `New Contact Form:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// -----------------
// Book Havan route
// -----------------
app.post("/api/book-havan", async (req, res) => {
  const { name, phone, havanType, message } = req.body;

  try {
    // Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Havan Booking from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}`
    });

    // WhatsApp
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: `New Havan Booking:\nName: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}`
    });

    // SMS
    await client.messages.create({
      from: process.env.TWILIO_SMS_NUMBER,
      to: process.env.MY_PHONE_NUMBER,
      body: `New Havan Booking:\nName: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}`
    });

    res.status(200).json({ message: "Havan booked successfully and notifications sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book Havan" });
  }
});

// -----------------
// Start server
// -----------------
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
