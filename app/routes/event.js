const express = require("express");
const router = express.Router();
const { event } = require("../controllers"); 
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const notifySubscribers = require("../middlewares/notifySubscribers");

router.post("/create", verifyUser, verifyAdmin, upload, convertImagesToWebP, event.createOrUpdateEvent, notifySubscribers);
router.get("/", verifyUser, event.getEvents);
router.get("/:id", verifyUser, event.getEventById); 
router.put("/:id", verifyUser, verifyAdmin, upload, convertImagesToWebP, event.updateEvent);
router.delete("/:id", verifyUser, verifyAdmin, event.deleteEvent);

module.exports = router;
