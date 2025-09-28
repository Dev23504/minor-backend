const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
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
// Twilio setup
// -----------------
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// -----------------
// Test route
// -----------------
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend is working fine 🚀" });
});

// -----------------
// Contact form route (Test Mode)
// -----------------
app.post("/api/contact", async (req, res) => {
  console.log("Contact Form Data:", req.body); // DEBUG
  // Send a test response first
  res.status(200).json({ message: "Contact form received (test mode)" });

  // Uncomment below to enable email & Twilio notifications later
  /*
  const { name, email, message } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: `New Contact Form:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

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
  */
});

// -----------------
// Book Havan route (Test Mode)
// -----------------
app.post("/api/book-havan", (req, res) => {
  console.log("Book Havan Data:", req.body); // DEBUG
  res.status(200).json({ message: "Havan booking received (test mode)" });

  // Uncomment below to enable email & Twilio notifications later
  /*
  const { name, phone, havanType, message } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Havan Booking from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}`
    });

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MY_WHATSAPP_NUMBER,
      body: `New Havan Booking:\nName: ${name}\nPhone: ${phone}\nHavan Type: ${havanType}\nMessage: ${message}`
    });

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
  */
});

// -----------------
// Start server
// -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
