import { s3Client, S3_BUCKET } from '../config/s3';
import { ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

async function testS3Connection() {
  console.log('🧪 Testing AWS S3 Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`   AWS_REGION: ${process.env.AWS_REGION}`);
  console.log(`   AWS_BUCKET_NAME: ${process.env.AWS_BUCKET_NAME}`);
  console.log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing'}`);
  console.log(`   AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing'}\n`);

  try {
    // Test 1: List objects in bucket
    console.log('🔍 Test 1: Listing bucket contents...');
    const listCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: 'users/',
      MaxKeys: 5,
    });
    
    const listResponse = await s3Client.send(listCommand);
    console.log(`✅ Success! Found ${listResponse.Contents?.length || 0} objects in users/ folder\n`);

    // Test 2: Upload a test file
    console.log('📤 Test 2: Uploading test file...');
    const testFileName = `users/test-${Date.now()}.txt`;
    const testContent = 'This is a test file from S3 upload verification';
    
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: testFileName,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });

    await s3Client.send(putCommand);
    const testUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${testFileName}`;
    console.log(`✅ Success! Test file uploaded`);
    console.log(`   URL: ${testUrl}\n`);

    // Summary
    console.log('🎉 All tests passed!');
    console.log('✅ S3 configuration is correct');
    console.log('✅ Credentials are valid');
    console.log('✅ Bucket is accessible');
    console.log('✅ Upload functionality works\n');
    console.log('🚀 Ready to use S3 user profile upload feature!');

  } catch (error: any) {
    console.error('❌ Test failed!\n');
    
    if (error.name === 'NoSuchBucket') {
      console.error('Error: Bucket does not exist');
      console.error(`Solution: Create bucket "${S3_BUCKET}" in AWS S3`);
    } else if (error.name === 'InvalidAccessKeyId') {
      console.error('Error: Invalid AWS Access Key ID');
      console.error('Solution: Check AWS_ACCESS_KEY_ID in .env file');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('Error: Invalid AWS Secret Access Key');
      console.error('Solution: Check AWS_SECRET_ACCESS_KEY in .env file');
    } else if (error.name === 'AccessDenied') {
      console.error('Error: Access denied to S3 bucket');
      console.error('Solution: Check IAM permissions for S3 access');
    } else {
      console.error('Error:', error.message);
      console.error('Details:', error);
    }
    
    process.exit(1);
  }
}

// Run the test
testS3Connection();
