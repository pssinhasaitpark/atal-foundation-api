
const express = require('express');
const router = express.Router();
const { home } = require('../controllers');
const { upload, convertImagesToWebP } = require('../middlewares/fileUploader');
const homeValidator = require('../validators/home');
const { verifyUser, verifyAdmin } = require('../middlewares/jwtAuth');

router.post('/create', verifyUser, verifyAdmin, upload, convertImagesToWebP, homeValidator, home.createHomeSection);
router.get('/', home.getAllHomeSections);
router.get('/:id', home.getHomeSectionById);
router.put('/:id', verifyUser, verifyAdmin, upload, convertImagesToWebP, homeValidator, home.updateHomeSection);
router.delete('/:id', verifyUser, verifyAdmin, home.deleteHomeSection);

module.exports = router;

