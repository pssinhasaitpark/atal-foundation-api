const express = require("express");
const router = express.Router();
const { gallery } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");

router.post("/create",verifyUser, verifyAdmin, upload, convertImagesToWebP, gallery.createGallery);
router.get("/", gallery.getAllGallery);
router.get("/:id", gallery.getGalleryById);
router.put("/:id",verifyUser,verifyAdmin,upload,convertImagesToWebP,gallery.updateGalleryById);
router.delete("/:id", verifyUser, verifyAdmin, gallery.deleteGalleryById);

module.exports = router;
