const express = require("express");
const router = express.Router();
const {  imageConversionMiddlewareMultiple} = require("../middlewares/upload");
const { audioQuote } = require("../controllers"); 
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser,verifyAdmin,imageConversionMiddlewareMultiple, audioQuote.createAudioQuote);
router.get("/", audioQuote.getAudioQuotes);
router.patch("/:audioQuoteId", verifyUser, verifyAdmin,imageConversionMiddlewareMultiple, audioQuote.updateAudioQuotes);
router.patch('/:audioQuoteId/sections/:sectionId?', verifyUser, verifyAdmin,imageConversionMiddlewareMultiple, audioQuote.updateAudioSection);
router.delete('/:audioQuoteId/sections/:sectionId', verifyUser, verifyAdmin, audioQuote.deleteAudioSection);
module.exports = router;
