const AWS = require("aws-sdk");
const fs = require("fs");

// Configure AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

export function uploadToS3(fileName: string, filePath: string) {
  // Read the file from disk
  const fileContent = fs.readFileSync(filePath);

  // Upload parameters
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
  };

  // Upload to S3
  return new Promise((resolve, reject) => {
    s3.upload(params, (err: Error, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}
