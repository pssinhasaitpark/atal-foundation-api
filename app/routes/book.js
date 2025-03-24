
const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/cloudinary");
const { createBook, getAllBooks, updateBooks, deleteBooks } = require("../controllers/book/book");
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post("/", verifyUser, verifyAdmin, upload, createBook);
router.get("/", getAllBooks);
router.patch('/:bookId', verifyUser, verifyAdmin, upload, updateBooks);
router.delete('/:bookId', verifyUser, verifyAdmin, deleteBooks)

module.exports = router;

