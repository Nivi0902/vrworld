const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
console.log(PORT);

// Initialize Express app
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.static(process.cwd())); // Serves all files from the root directory
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error: ", error);
  } else {
    console.log("SMTP is ready to send emails.");
  }
});

// Handle form submission (POST request)
app.post("/send", (req, res) => {
  console.log("Received request at /send"); // Log when the request is received
  console.log("Request body:", req.body); // Log the incoming data

  const data = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.error("Invalid email format:", data.email); // Log invalid email
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Sanitize input
  const name = data.name.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const email = data.email.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const message = data.message.replace(/<[^>]*>/g, ""); // Remove HTML tags

  // Construct the email
  const mail = {
    from: `${name} <${email}>`,
    to: process.env.EMAIL,
    subject: "Contact Request", // Ensure the subject is set
    text: `Contact Request\nName: ${name}\n\nEmail: ${email}\n\nMessage: ${message}`,
    html: `<p><strong>Contact Request</strong></p>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br>${message}</p>`
  };

  // Log the mail object to verify its contents
  console.log("Mail object:", mail); // Log the mail object

  // Send the email using your email transport method
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.error("Email sending error:", err);
      return res.status(500).json({ error: "Email sending error." });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ message: "Email sent successfully!" });
    }
  });
});

// Handle GET request to /send
app.get("/send", (req, res) => {
  res.status(200).json({ message: "GET request received" });
});

// Serve index.html
app.get("/Contact details.html", (req, res) => {
  res.sendFile(process.cwd() + "/Contact details.html");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

