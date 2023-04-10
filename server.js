// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
// Initialize Express app
dotenv.config();
const app = express();


const port = process.env.PORT || 5000;

// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(cors());
// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // You can use other email services, such as 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// Contact route
app.post('/contact', async (req, res) => {
  const { firstName,lastName, email,phone, message } = req.body;
  // Input validation
  if (!firstName || !email || !message || !lastName || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Configure email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL, // Replace with your email address where you want to receive the messages
    subject: `New Contact Form ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName} \nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Contact form submitted successfully.',code:200 });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email.',code:500 });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
