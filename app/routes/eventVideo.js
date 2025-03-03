const express = require('express');
const router = express.Router();
const { eventVideo } = require('../controllers');
const {upload, uploadVideoToCloudinary}= require('../middlewares/cloudinary');

router.post('/add',upload, eventVideo.createEventVideo);
router.get('/', eventVideo.getAllEventVideo);
router.get('/:id', eventVideo.getEventVideoById);
router.patch('/update/:id', upload, eventVideo.updateEventVideo);
router.delete('/:id', eventVideo.deleteEventVideo);

module.exports = router;


