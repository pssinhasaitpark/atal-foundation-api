const express = require('express');
const router = express.Router();
const { homePage } = require('../controllers');
const { upload }= require('../middlewares/cloudinary');
const { verifyUser, verifyAdmin } = require("../middlewares/jwtAuth");

router.post('/', verifyUser, verifyAdmin, upload, homePage.createHomePage);
router.get('/', homePage.getHomePage);
router.patch('/:id',  verifyUser, verifyAdmin, upload, homePage.updateHomePage);
router.delete('/:id',  verifyUser, verifyAdmin, homePage.deleteHomePage);

module.exports = router;
