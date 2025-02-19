const Contact = require("../../models/contact");
const { handleResponse } = require("../../utils/helper");

exports.createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    return handleResponse(res, 201, "Contact inquiry submitted successfully", {
      contact: newContact,
    });
  } catch (err) {
    return handleResponse(res, 500, "Internal server error", { error: err });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return handleResponse(res, 200, "Contact inquiries retrieved", { contacts });
  } catch (err) {
    return handleResponse(res, 500, "Internal server error", { error: err });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return handleResponse(res, 404, "Contact inquiry not found");

    return handleResponse(res, 200, "Contact inquiry retrieved", { contact });
  } catch (err) {
    return handleResponse(res, 500, "Internal server error", { error: err });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return handleResponse(res, 404, "Contact inquiry not found");

    return handleResponse(res, 200, "Contact inquiry deleted successfully");
  } catch (err) {
    return handleResponse(res, 500, "Internal server error", { error: err });
  }
};
