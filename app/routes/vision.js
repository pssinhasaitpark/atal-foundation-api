const express = require('express');
const router = express.Router();
const { createVision, getAllVision, getVisionById, updateVision, deleteVision } = require('../controllers/vision/visionController');
const visionValidator = require('../validators/visionValidators');
const multer = require('../middlewares/multer');
const { verifyUser, verifyAdmin } = require('../middlewares/jwtAuth');

router.post('/create', verifyUser, verifyAdmin, multer.single('image'), visionValidator, createVision);
router.get('/', getAllVision);
router.get('/:id', getVisionById);
router.put('/:id', verifyUser, verifyAdmin, multer.single('image'), visionValidator, updateVision);
router.delete('/:id', verifyUser, verifyAdmin, deleteVision);

module.exports = router;
