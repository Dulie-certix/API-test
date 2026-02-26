import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET } from '../config/s3';

const storage = multer.memoryStorage();

export const uploadToS3 = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
  const fileName = `users/${Date.now()}-${file.originalname}`;
  
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  
  return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};
