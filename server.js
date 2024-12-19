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
  const data = req.body;

  const mail = {
    from: `${data.name} <${data.email}>`,
    to: process.env.EMAIL,
    subject: "Contact Request",
    text: `Contact Request\nName: ${data.name}\n\nEmail: ${data.email}\n\nPhone: ${data.phone}\n\nMessage: ${data.message}`,
    html: `<p><strong>Contact Request</strong></p>
           <p><strong>Name:</strong> ${data.name}</p>
           <p><strong>Email:</strong> ${data.email}</p>
           <p><strong>Phone:</strong> ${data.phone}</p>
           <p><strong>Message:</strong><br>${data.message}</p>`
  };

  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.error("Email sending error:", err);
      return res.status(500).json({ error: "Email sending error." });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ message: "Email successfully sent to recipient!" });
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
