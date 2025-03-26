const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/cloudinary");
const { imageConversionMiddlewareMultiple } = require("../middlewares/upload");

const { event } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, event.createEvent);
router.get("/", event.getAllEvents);
router.get("/:id", event.getEventById);
router.patch("/:eventId", verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, event.updateEvent);
router.patch('/:eventId/section/:sectionId', verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, event.updateEventSection);
router.delete("/section/:sectionId", verifyUser, verifyAdmin, event.deleteEventSection);
router.delete("/:eventId", verifyUser, verifyAdmin, event.deleteEvent)
module.exports = router;