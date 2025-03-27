const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,    
  },
});

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      // text,
      html
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed");
    }
  };

module.exports = sendEmail;