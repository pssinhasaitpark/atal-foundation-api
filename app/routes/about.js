// const express = require("express");
// const router = express.Router();
// const { about } = require("../controllers");
// const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");

// // Define the POST route for creating About section
// router.post("/", upload, convertImagesToWebP, about.createAboutSection);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { about } = require("../controllers");
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");

router.post("/", upload, convertImagesToWebP, about.createAboutSection); 
router.get("/", about.getAllAboutSections);
router.get("/:id", about.getAboutSection); 
router.patch("/:aboutId/sections/:sectionId",upload,convertImagesToWebP, about.updateAboutSection);
router.delete('/:aboutId/sections/:sectionId', about.deleteAboutSection);
router.post("/:id/remove-image", about.removeImageFromAboutSection); 

module.exports = router;


 


