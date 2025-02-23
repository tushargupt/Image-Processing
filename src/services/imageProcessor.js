const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const queue = require('./queueService');
const { uploadToCloud } = require('../utils/storage');
const ProcessingRequest = require('../models/ProcessingRequest');
const Product = require('../models/Product');

class ImageProcessor {
    async processImages(requestId, products) {
        const jobId = await queue.addJob({ requestId, products });
        
        queue.on('processingStarted', async (job) => {
            if (job.data.requestId === requestId) {
                await ProcessingRequest.findOneAndUpdate(
                    { requestId },
                    { status: 'processing' }
                );
            }
        });

        queue.on('progress', async ({ jobId: currentJobId, progress }) => {
            if (currentJobId === jobId) {
                await ProcessingRequest.findOneAndUpdate(
                    { requestId },
                    { progress }
                );
            }
        });

        queue.on('processingCompleted', async (job) => {
            if (job.data.requestId === requestId) {
                await ProcessingRequest.findOneAndUpdate(
                    { requestId },
                    { 
                        status: 'completed',
                        completedAt: new Date()
                    }
                );
            }
        });

        return jobId;
    }

    async processImage(imageUrl) {
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer'
        });

        const processedBuffer = await sharp(response.data)
            .jpeg({ quality: 50 })
            .toBuffer();

        const filename = `${Date.now()}-${path.basename(imageUrl)}`;
        const outputUrl = await uploadToCloud(processedBuffer, filename);
        
        return outputUrl;
    }
}

module.exports = new ImageProcessor();