const express = require("express");
const router = express.Router();
const { about } = require("../controllers");
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");
const {imageConversionMiddlewareMultiple } = require("../middlewares/upload");

const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

// router.post("/", upload, convertImagesToWebP, about.createAboutSection); 
router.post("/", imageConversionMiddlewareMultiple, about.createAboutSection); 

router.get("/", about.getAllAboutSections);
router.get("/:id", about.getAboutSection); 
router.patch("/:aboutId/sections/:sectionId",verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, about.updateAboutSection);
router.delete('/:aboutId/sections/:sectionId', about.deleteAboutSection);
router.post("/:id/remove-image", about.removeImageFromAboutSection); 

module.exports = router;


 


