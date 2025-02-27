const express = require("express");
const router = express.Router();
const { event } = require("../controllers"); 
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const notifySubscribers = require("../middlewares/notifySubscribers");

router.post("/create", verifyUser, verifyAdmin, upload, convertImagesToWebP, event.createOrUpdateEvent, notifySubscribers);
router.get("/", verifyUser, event.getEvents);
router.get("/:id", verifyUser, event.getEventById); 
router.patch("/:id", verifyUser, verifyAdmin, upload, convertImagesToWebP, event.updateEvent);
router.delete("/:id", verifyUser, verifyAdmin, event.deleteEvent);
router.patch("/:eventId/image-section/:imageSectionId", upload, event.updateImageSection);
router.patch("/:eventId/video-section/:videoSectionId", upload, event.updateVideoSection);

module.exports = router;



