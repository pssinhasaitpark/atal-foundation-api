const express = require("express");
const { socialMedia } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");

const router = express.Router();

router.get("/", verifyUser, verifyAdmin, socialMedia.getSocialMedia); // Public (Users can read)
router.post("/", verifyUser, verifyAdmin,upload, convertImagesToWebP, socialMedia.createSocialMedia); // Admin only
router.delete("/", verifyAdmin, socialMedia.deleteSocialMedia); // Admin only
router.patch("/:id", verifyUser, upload, convertImagesToWebP,verifyAdmin, socialMedia.updateSocialMedia)
module.exports = router;
 