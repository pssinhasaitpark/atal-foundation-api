const express = require("express");
const router = express.Router();
const { contact } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { sendContactNotificationEmail } = require("../middlewares/sendEmailMiddleware");

router.post("/create", sendContactNotificationEmail, contact.createContact);
router.get("/", verifyUser, verifyAdmin, contact.getAllContacts);
router.get("/:id", verifyUser, verifyAdmin, contact.getContactById);
router.delete("/:id", verifyUser, verifyAdmin, contact.deleteContact);

module.exports = router;
