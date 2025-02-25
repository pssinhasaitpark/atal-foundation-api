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

router.post("/", upload, convertImagesToWebP, about.createAboutSection); // Create About Section
router.get("/", about.getAllAboutSections);
router.get("/:id", about.getAboutSection); // Read About Section by ObjectId
router.patch("/:aboutId/sections/:sectionId",upload, about.updateAboutSection);
router.delete('/:aboutId/sections/:sectionId', about.deleteAboutSection);
router.post("/:id/remove-image", about.removeImageFromAboutSection); // Remove Image from About Section

module.exports = router;


 


