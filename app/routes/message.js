const express = require("express");
const router = express.Router();
const { message } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { sendMessageNotificationEmail } = require("../middlewares/sendEmailMiddleware")

router.post("/create", sendMessageNotificationEmail, message.createMessage);
router.get("/", verifyUser, verifyAdmin, message.getAllMessages);
router.get("/:id", verifyUser, verifyAdmin, message.getMessageById);
router.delete("/:id", verifyUser, verifyAdmin, message.deleteMessageById);

module.exports = router;
