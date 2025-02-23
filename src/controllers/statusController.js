const ProcessingRequest = require('../models/ProcessingRequest');
const Product = require('../models/Product');

exports.checkStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await ProcessingRequest.findOne({ requestId });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const products = await Product.find({ requestId });
    
    res.json({
      status: request.status,
      progress: request.progress,
      products: products.map(p => ({
        productName: p.productName,
        status: p.processingStatus,
        inputUrls: p.inputImageUrls,
        outputUrls: p.outputImageUrls
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};