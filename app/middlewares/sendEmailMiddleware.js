
const sendEmail = require("../utils/emailHandler");
const path = require("path");
const fs = require('fs');
const ejs = require('ejs');

const sendRegistrationEmail = async (req, res, next) => {
  try {
    const { first_name, last_name, email, mobile, address, gender, date_of_birth, state, category, designation, message } = req.body;


    const templatePath = path.join(__dirname, '..', '..', 'public', 'index.html');

    const template = fs.readFileSync(templatePath, 'utf-8');

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

    await sendEmail("atalfoundation@gmail.com", "New User Registration - Atal Foundation", emailContent);

    next();
  } catch (error) {
    console.error("Error sending registration email:", error);
    next(error);
  }
};

const sendMessageNotificationEmail = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const templatePath = path.join(__dirname, '..', '..', 'public', 'message.html');

    const template = fs.readFileSync(templatePath, 'utf-8');

    const emailContent = ejs.render(template, {
      name,
      email,
      message,
    });

    await sendEmail("atalfoundation@gmail.com", "New User Message - Atal Foundation", emailContent);

    next();
  } catch (error) {
    console.error("Error sending message notification email:", error);
    next(error);
  }
};

const sendContactNotificationEmail = async (req, res, next) => {
  try {
    const { name, email, contact_no, enquiry } = req.body;

    const templatePath = path.join(__dirname, "..", "..", "public", "contact.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    const emailContent = ejs.render(template, {
      name,
      email,
      contact_no,
      enquiry,
    });

    await sendEmail(
      "atalfoundation@gmail.com",
      "New Contact Inquiry - Atal Foundation",
      emailContent
    );

    next();
  } catch (error) {
    console.error("Error sending contact notification email:", error);
    next(error);
  }
};

const sendSubscriptionConfirmationEmail = async (email) => {
  try {
    const templatePath = path.join(__dirname, "..", "..", "public", "subscription.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    const emailContent = ejs.render(template, {});

    await sendEmail(email, "Subscription Confirmation from ATAL FOUNDATION", emailContent);
  } catch (error) {
    console.error("Error sending subscription confirmation email:", error);
  }
};

module.exports = {
  sendRegistrationEmail,
  sendMessageNotificationEmail,
  sendContactNotificationEmail,
  sendSubscriptionConfirmationEmail,
};

module.exports = { sendRegistrationEmail, sendMessageNotificationEmail, sendContactNotificationEmail, sendSubscriptionConfirmationEmail };

