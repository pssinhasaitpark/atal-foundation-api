const Subscribers = require("../../models/subscribers");
const { handleResponse } = require("../../utils/helper");
const sendEmail = require("../../utils/emailHandler")
 
const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return handleResponse(res, 400, "Invalid email address.");
    }

    const existingSubscriber = await Subscribers.findOne({ email });
    if (existingSubscriber) {
      return handleResponse(res, 400, "Email is already subscribed.");
    }

    const newSubscriber = new Subscribers({ email });
    await newSubscriber.save();

    await sendEmail(email, "Subscription Confirmation from ATAL FOUNDATION", `Thank you for Subscribing! \nBest Regards!!! \nATAL FOUNDATION`);

    return handleResponse(res, 201, "Subscribed successfully!", {
      subscriber: newSubscriber,
    });
  } catch (error) {
    console.error("Error in subscribeUser:", error); 
    return handleResponse(res, 500, "Error subscribing user", {
      error: error.message,
    });
  }
};
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscribers.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Subscribers retrieved successfully", {
      subscribers,
    });
  } catch (error) {
    return handleResponse(res, 500, "Error fetching subscribers", {
      error: error.message,
    });
  }
};

module.exports = { subscribeUser, getAllSubscribers };
