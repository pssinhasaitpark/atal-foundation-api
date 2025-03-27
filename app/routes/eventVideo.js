const express = require('express');
const router = express.Router();
const { eventVideo } = require('../controllers');
const {imageAndVideoUploadMiddleware}= require('../middlewares/upload');

router.post('/add',imageAndVideoUploadMiddleware, eventVideo.createEventVideo);
router.get('/', eventVideo.getAllEventVideo);
router.get('/:id', eventVideo.getEventVideoById);
router.patch('/update/:id', imageAndVideoUploadMiddleware, eventVideo.updateEventVideo);
router.delete('/:id', eventVideo.deleteEventVideo);

module.exports = router;


