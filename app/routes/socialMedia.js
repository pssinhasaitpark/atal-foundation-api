const express = require("express");
const { socialMedia } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");

const router = express.Router();

router.get("/", socialMedia.getSocialMedia); 
router.post("/", verifyUser, verifyAdmin,upload, convertImagesToWebP, socialMedia.createSocialMedia); 
router.delete("/", verifyAdmin, socialMedia.deleteSocialMedia); 
router.patch("/:id", verifyUser, upload, convertImagesToWebP,verifyAdmin, socialMedia.updateSocialMedia)
module.exports = router;
 