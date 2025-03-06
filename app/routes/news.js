const express = require('express');
const router = express.Router();
const { news } = require('../controllers');
const { upload } = require('../middlewares/cloudinary');
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth")

router.post('/add', verifyUser, verifyAdmin, upload, news.createNews);
router.get('/', news.getAllNews);
router.get('/:id', news.getNewsById);
router.patch('/update/:id', upload, news.updateNewsById);
router.delete('/:id', news.deleteNewsById);

module.exports = router;




