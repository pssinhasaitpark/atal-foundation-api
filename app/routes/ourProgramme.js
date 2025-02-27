const express = require("express");
const router = express.Router();
const { ourProgramme } = require("../controllers");
const { upload,convertImagesToWebP ,convertImagesToWebPMultiple} = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/our-programme", verifyUser, verifyAdmin, upload, convertImagesToWebPMultiple, ourProgramme.createOurProgramme);
router.get("/", verifyUser, ourProgramme.getourProgrammes);
router.get("/:id", verifyUser, ourProgramme.getourProgrammeById);
router.patch("/:id", verifyUser, verifyAdmin, upload, ourProgramme.updateourProgramme);
router.delete("/:id", verifyUser, verifyAdmin, ourProgramme.deleteourProgramme);

module.exports = router;
