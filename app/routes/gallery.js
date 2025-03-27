const express = require("express");
const router = express.Router();
const { gallery } = require("../controllers");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { imageAndVideoUploadMiddleware ,imageConversionMiddlewareMultiple} = require("../middlewares/upload");

router.post("/create", verifyUser, verifyAdmin, imageAndVideoUploadMiddleware, gallery.createOrUpdateGallery);
router.get("/", gallery.getAllGallery);
router.get("/:id", gallery.getGalleryById);
router.put("/:id", verifyUser, verifyAdmin, imageAndVideoUploadMiddleware, gallery.updateGalleryById);
router.delete("/:id", verifyUser, verifyAdmin, gallery.deleteGalleryById);
router.put("/image/:imageId", verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, gallery.updateGalleryBySection);
router.put("/video/:videoId", verifyUser, verifyAdmin, imageAndVideoUploadMiddleware, gallery.updateGalleryBySection);

module.exports = router;

