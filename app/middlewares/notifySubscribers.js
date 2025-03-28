const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const Subscribers = require("../models/subscribers");
const sendEmail = require("../utils/emailHandler");

const notifySubscribers = async (req, res, next) => {
  try {
    if (req.contentCreated && req.contentTitle && req.contentType) {
      const subscribers = await Subscribers.find();

      const templatePath = path.join(__dirname, "..", "..", "public", "notify.html");

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at ${templatePath}`);
      }

      const template = fs.readFileSync(templatePath, "utf-8");

      const emailContent = ejs.render(template, {
        contentType: req.contentType,
        contentTitle: req.contentTitle,
        contentUrl: `${process.env.NOTIFICATION_URL}/${req.contentType.toLowerCase()}`,
      });

      const subject = `New ${req.contentType} Posted on ATAL FOUNDATION`;

      const emailPromises = subscribers.map((subscriber) =>
        sendEmail(subscriber.email, subject, emailContent)
      );

      await Promise.all(emailPromises);
    }

    next();
  } catch (error) {
    console.error(`❌ Error notifying subscribers: ${error.message}`);
    next(); 
  }
};

module.exports = notifySubscribers;

