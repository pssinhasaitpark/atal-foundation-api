const express = require('express');
const router = express.Router();
const { news } = require('../controllers');
const { upload } = require('../middlewares/cloudinary');
const { imageConversionMiddlewareMultiple } = require('../middlewares/upload');

const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth")

router.post('/add', verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, news.createNews);
router.get('/', news.getAllNews);
router.get('/:id', news.getNewsById);
router.patch('/update/:id', verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, news.updateNewsById);
router.delete('/:id', news.deleteNewsById);

module.exports = router;




