const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.CLOUD_STORAGE_KEY,      
  secretAccessKey: process.env.CLOUD_STORAGE_SECRET,
  region: process.env.CLOUD_STORAGE_REGION       
});

async function uploadToCloud(buffer, filename) {
  try {
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const uploadParams = {
      Bucket: process.env.CLOUD_STORAGE_BUCKET,  
      Key: uniqueFilename,
      Body: buffer,
      ContentType: 'image/jpeg',  
      ACL: 'public-read'          
    };

    // Upload file to S3
    const uploadResult = await s3.upload(uploadParams).promise();

    return uploadResult.Location; // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Cloud Upload Error:', error);
    throw new Error('Failed to upload file');
  }
}

module.exports = { uploadToCloud };
