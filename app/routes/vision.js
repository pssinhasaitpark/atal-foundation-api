const express = require('express');
const router = express.Router();
const { vision } = require('../controllers');
const { upload, convertImagesToWebP } = require('../middlewares/fileUploader');
const visionValidator = require('../validators/vision');
const { verifyUser, verifyAdmin } = require('../middlewares/jwtAuth');


router.post('/create', verifyUser, verifyAdmin, upload, convertImagesToWebP, visionValidator, vision.createVision);
router.get('/', vision.getAllVision);
router.get('/:id', vision.getVisionById);
router.put('/:id', verifyUser, verifyAdmin,upload, convertImagesToWebP, visionValidator, vision.updateVision);
router.delete('/:id', verifyUser, verifyAdmin, vision.deleteVision);

module.exports = router;
 