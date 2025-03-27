const express = require("express");
const router = express.Router();
const { ourProgramme } = require("../controllers");
const { imageConversionMiddlewareMultiple} = require("../middlewares/upload");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, ourProgramme.createOurProgramme);
router.get("/", ourProgramme.getourProgrammes);
router.get('/category/:category', ourProgramme.getByCategory);
router.patch("/update/:category", verifyUser, verifyAdmin,imageConversionMiddlewareMultiple, ourProgramme.updateOurProgramme);
router.patch("/update/:category/details/:detailId",imageConversionMiddlewareMultiple, ourProgramme.updateOurProgrammeById);
router.delete("/delete/:category/details/:detailId", ourProgramme.deleteOurProgrammeSectionByID);
router.delete("/delete/:categoryId", ourProgramme.deleteOurProgrammeCategory);
module.exports = router;
