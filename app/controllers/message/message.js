const Message = require("../../models/message");
const messageValidator = require("../../validators/message");
const { handleResponse } = require("../../utils/helper");

exports.createMessage = async (req, res) => {
  const { error } = messageValidator.validate(req.body);
  if (error) {
    return handleResponse(res, 400, "Validation error", { errors: error.details });
  }

  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    return handleResponse(res, 201, "Message Submitted Successfully", { message: newMessage });
  } catch (err) {
    return handleResponse(res, 500, "Internal Server Error", { error: err.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Messages Retrieved Successfully", { messages });
  } catch (err) {
    return handleResponse(res, 500, "Internal Server Error", { error: err.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return handleResponse(res, 404, "Message not found");

    return handleResponse(res, 200, "Message Retrieved Successfully", { message });
  } catch (err) {
    return handleResponse(res, 500, "Internal Server Error", { error: err.message });
  }
};

exports.deleteMessageById = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return handleResponse(res, 404, "Message not found");

    return handleResponse(res, 200, "Message Deleted Successfully");
  } catch (err) {
    return handleResponse(res, 500, "Internal Server error", { error: err.message });
  }
};
