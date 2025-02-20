const express = require("express");
const router = express.Router();
const { event } = require("../controllers"); // Update this line to match your event controller
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/create", verifyUser, verifyAdmin, upload, convertImagesToWebP, event.createEvent);
router.get("/", verifyUser, event.getEvents);
router.get("/:id", verifyUser, event.getEventById); // Assuming you have a getEventById function in your event controller
router.put("/:id", verifyUser, verifyAdmin, upload, convertImagesToWebP, event.updateEvent);
router.delete("/:id", verifyUser, verifyAdmin, event.deleteEvent);

module.exports = router;
