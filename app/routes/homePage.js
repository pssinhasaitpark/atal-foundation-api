const express = require('express');
const router = express.Router();
const { homePage } = require('../controllers');
const {  imageConversionMiddlewareMultiple}= require('../middlewares/upload');
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post('/', verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, homePage.createHomePage);
router.get('/', homePage.getHomePage);
router.patch('/:id',  verifyUser, verifyAdmin, imageConversionMiddlewareMultiple, homePage.updateHomePage);
router.delete('/:id',  verifyUser, verifyAdmin, homePage.deleteHomePage);

module.exports = router;
