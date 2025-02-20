const express = require("express");
const router = express.Router();
const { message } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/create", message.createMessage);
router.get("/", verifyUser, verifyAdmin, message.getAllMessages);
router.get("/:id", verifyUser, verifyAdmin, message.getMessageById);
router.delete("/:id", verifyUser, verifyAdmin, message.deleteMessageById);

module.exports = router;
