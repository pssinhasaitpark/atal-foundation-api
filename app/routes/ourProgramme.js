const express = require("express");
const router = express.Router();
const { ourProgramme } = require("../controllers");
const { upload,convertImagesToWebP ,convertImagesToWebPMultiple} = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");
const { getByCategory } = require("../controllers/ourProgramme/ourProgramme");

router.post("/", verifyUser, verifyAdmin, upload, convertImagesToWebP, ourProgramme.createOurProgramme);
router.get("/", ourProgramme.getourProgrammes);
router.get('/category/:category', ourProgramme.getByCategory);
router.get("/:id", verifyUser, ourProgramme.getourProgrammeById);
router.patch("/update/:category", verifyUser, verifyAdmin, upload, convertImagesToWebP, ourProgramme.updateOurProgramme);
router.delete("/:id", verifyUser, verifyAdmin, ourProgramme.deleteourProgramme);

module.exports = router;
