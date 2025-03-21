const express = require("express");
const router = express.Router();
const { uploadAudio } = require("../middlewares/fileUploader");
const { audioQuote } = require("../controllers"); 
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser,verifyAdmin, uploadAudio, audioQuote.createAudioQuote);
router.get("/", audioQuote.getAudioQuotes);
router.get("/:id", audioQuote.getAudioQuotesById);
router.post("/:id", verifyUser, verifyAdmin, audioQuote.updateAudioQuoteById);

module.exports = router;
