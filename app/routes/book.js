
const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/cloudinary");
const { imageConversionMiddlewareMultiple } = require("../middlewares/upload");
const { createBook, getAllBooks, updateBooks, deleteBooks } = require("../controllers/book/book");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

// router.post("/", verifyUser, verifyAdmin, upload, createBook);
router.post("/", verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, createBook);
router.get("/", getAllBooks);
router.patch('/:bookId', verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, updateBooks);
router.delete('/:bookId', verifyUser, verifyAdmin, deleteBooks)

module.exports = router;

