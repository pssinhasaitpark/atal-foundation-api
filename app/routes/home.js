
const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const { createHomeSection, getAllHomeSections, getHomeSectionById, updateHomeSection, deleteHomeSection } = require('../controllers/home/homeController');
const homeValidator = require('../validators/homeValidators');
const { verifyUser, verifyAdmin } = require('../middlewares/jwtAuth');

router.post('/create', verifyUser, verifyAdmin, multer.array('images'), homeValidator, createHomeSection);
router.get('/', getAllHomeSections);
router.get('/:id', getHomeSectionById);
router.put('/update/:id', verifyUser, verifyAdmin, multer.array('images'), homeValidator, updateHomeSection);
router.delete('/delete/:id', verifyUser, verifyAdmin, deleteHomeSection);

module.exports = router;
