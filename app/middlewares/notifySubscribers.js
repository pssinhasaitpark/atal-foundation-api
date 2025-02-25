const Subscribers = require("../models/subscribers");
const sendEmail = require("../utils/emailHandler"); 

const notifySubscribers = async (req, res, next) => {
  try {
    if (req.method === "POST" && req.contentCreated) {
      const subscribers = await Subscribers.find();
      const subject = "New Content Posted on ATAL FOUNDATION";
    const message = `Check out our new content: <a href="https://atal-foundation.netlify.app ${req.contentTitle}">${req.contentTitle}</a>`;


      const emailPromises = subscribers.map(subscriber => {
        return sendEmail(subscriber.email, subject, message);
      });

      await Promise.all(emailPromises);
      console.log("Notifications sent to all subscribers.");
    }
    next(); 
  } catch (error) {
    console.error("Error notifying subscribers:", error);
    next(); 
  }
};

module.exports = notifySubscribers;
