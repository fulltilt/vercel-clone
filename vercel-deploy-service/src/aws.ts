const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Configure AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

export async function downloadS3Folder(prefix: string) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    };

    const data = await s3.listObjectsV2(params).promise();

    const promises: any[] = [];
    data.Contents.forEach((obj: any) => {
      const fileKey = obj.Key;
      const filePath = path.join(__dirname, fileKey);
      const dirName = path.dirname(filePath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      };

      promises.push(
        s3
          .getObject(getObjectParams)
          .promise()
          .then((data: any) => {
            return new Promise((resolve, reject) => {
              fs.writeFile(filePath, data.Body, (err: Error) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            });
          })
      );
    });

    await Promise.all(promises);
    console.log("Folder downloaded successfully.");
  } catch (err) {
    console.error("Error downloading folder:", err);
  }
}

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
