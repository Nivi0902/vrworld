const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
console.log(PORT)

// Initialize Express app
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.static(process.cwd())); // Serves all files from the root directory



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

// Handle form submission
app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  form.parse(req, function (err, fields) {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).send("Something went wrong.");
    }

    let data = {};
    Object.keys(fields).forEach(property => {
      data[property] = fields[property].toString();
    });

    const mail = {
      from: `${data.name} <${data.email}>`,
      to: process.env.EMAIL,
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };

    transporter.sendMail(mail, (err, info) => {
      if (err) {
        console.error("Email sending error:", err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});


// Serve index.html
app.get("/Contact details.html", (req, res) => {
  res.sendFile(process.cwd() + "/Contact details.html");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
