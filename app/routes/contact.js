const express = require("express");
const router = express.Router();
const { contact } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/create", contact.createContact);
router.get("/", verifyUser, verifyAdmin, contact.getAllContacts);
router.get("/:id", verifyUser, verifyAdmin, contact.getContactById);
router.delete("/:id", verifyUser, verifyAdmin, contact.deleteContact);

module.exports = router;
