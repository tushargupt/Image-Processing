const { v4: uuidv4 } = require('uuid');
const ProcessingRequest = require('../models/ProcessingRequest');
const { parseAndValidate } = require('../utils/csvParser');
const imageProcessor = require('../services/imageProcessor');

exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file provided' });
    }

    const requestId = uuidv4();
    const products = await parseAndValidate(req.file.path);
    
    await ProcessingRequest.create({ requestId });
    const jobId = await imageProcessor.processImages(requestId, products);

    res.json({
      requestId,
      jobId,
      message: 'Processing started'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};