const express = require("express");
const router = express.Router();
const { createProgramme, getProgrammes } = require("../controllers/ourProgrammes/ourProgrammes");
const { upload, convertImagesToWebP } = require("../middlewares/fileUploader");

router.post("/", upload, convertImagesToWebP, createProgramme);
router.get("/", getProgrammes);

module.exports = router;
