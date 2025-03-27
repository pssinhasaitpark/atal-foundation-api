const express = require("express");
const router = express.Router();
const { supportSpeaker, } = require("../controllers");
const { imageConversionMiddlewareMultiple } = require("../middlewares/upload");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

// ➡️ Route to create Support Speaker
router.post("/", verifyUser, verifyAdmin,imageConversionMiddlewareMultiple, supportSpeaker.createSupportSpeaker);
router.get("/", supportSpeaker.getAllSupportSpeaker);
router.get("/:id", supportSpeaker.getSupportSpeakerById);
router.patch("/update/:id", verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, supportSpeaker.updateSupportSpeakerById);
router.delete("/delete/:id", verifyUser, verifyAdmin, supportSpeaker.deleteSupportSpeakerById)
module.exports = router;
