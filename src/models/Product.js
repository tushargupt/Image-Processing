const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true
  },
  serialNumber: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  inputImageUrls: [{
    type: String
  }],
  outputImageUrls: [{
    type: String
  }],
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Product', productSchema);