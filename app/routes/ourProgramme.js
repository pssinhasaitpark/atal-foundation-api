const express = require("express");
const router = express.Router();
const { ourProgramme } = require("../controllers");
const { upload,convertImagesToWebP ,convertImagesToWebPMultiple} = require("../middlewares/fileUploader");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser, verifyAdmin, upload, convertImagesToWebP, ourProgramme.createOurProgramme);
router.get("/", ourProgramme.getourProgrammes);
router.get('/category/:category', ourProgramme.getByCategory);
router.patch("/update/:category", verifyUser, verifyAdmin, upload, convertImagesToWebP, ourProgramme.updateOurProgramme);
router.patch("/update/:category/details/:detailId",upload, ourProgramme.updateOurProgrammeById);
router.delete("/delete/:category/details/:detailId", ourProgramme.deleteOurProgrammeSectionByID);
router.delete("/delete/:categoryId", ourProgramme.deleteOurProgrammeCategory);
module.exports = router;
