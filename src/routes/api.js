const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadController = require('../controllers/uploadController');
const statusController = require('../controllers/statusController');

// Upload endpoint
router.post('/upload', upload.single('csv'), uploadController.handleUpload);

// Status endpoint
router.get('/status/:requestId', statusController.checkStatus);

module.exports = router;