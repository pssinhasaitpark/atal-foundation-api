
const sendEmail = require("../utils/emailHandler");
const path = require("path"); // To construct the path dynamically
const fs = require('fs');
const ejs = require('ejs'); // For rendering dynamic HTML templates

const sendRegistrationEmail = async (req, res, next) => {
  try {
    // Extract data from the request body
    const { first_name, last_name, email, mobile, address, gender, date_of_birth, state, category, designation, message } = req.body;


    // Path to the email template
    const templatePath = path.join(__dirname, '..', '..', 'public', 'index.html');

    // Read the HTML template file
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the email content by injecting the dynamic data into the template
    const emailContent = ejs.render(template, {
      first_name,
      last_name,
      email,
      mobile,
      address,
      gender,
      date_of_birth,
      state,
      category,
      designation,
      message,
      // logoUrl
    });

    // Send the email using the sendEmail function
    await sendEmail("sinhansaitparkps@gmail.com", "New User Registration - Atal Foundation", emailContent);

    next();
  } catch (error) {
    console.error("Error sending registration email:", error);
    next(error);
  }
};

const sendMessageNotificationEmail = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Path to the email template
    const templatePath = path.join(__dirname, '..', '..', 'public', 'message.html');

    // Read the HTML template file
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the email content by injecting the dynamic data into the template
    const emailContent = ejs.render(template, {
      name,
      email,
      message,
    });

    // Send the email using the sendEmail function
    await sendEmail("sinhansaitparkps@gmail.com", "New User Message - Atal Foundation", emailContent);

    next();
  } catch (error) {
    console.error("Error sending message notification email:", error);
    next(error);
  }
};
module.exports = { sendRegistrationEmail, sendMessageNotificationEmail };

