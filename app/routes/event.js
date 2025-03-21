const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/cloudinary");
const { event } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser, verifyAdmin, upload, event.createEvent);
router.get("/", event.getAllEvents);
router.get("/:id", event.getEventById);
router.patch("/:eventId", verifyUser, verifyAdmin, upload, event.updateEvent);
router.patch('/:eventId/section/:sectionId', verifyUser, verifyAdmin, upload, event.updateEventSection);
router.delete("/section/:sectionId", verifyUser, verifyAdmin, event.deleteEventSection);
router.delete("/:eventId", verifyUser, verifyAdmin, event.deleteEvent)
module.exports = router;