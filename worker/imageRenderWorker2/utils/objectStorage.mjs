import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function uploadBuffer(filename, buffer, metadata) {
  const s3Client = createS3Client();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    Metadata: { 'v1': JSON.stringify(metadata) },
    ContentType: 'video/mp4',
  };

  const command = new PutObjectCommand(params);
  const response = await s3Client.send(command);
  console.log(`File ${filename} uploaded successfully -> https://${process.env.S3_BUCKET_NAME}.${process.env.S3_DOMAIN}/${filename}`);
}


export async function listFiles() {
  const { authorizationToken, apiUrl } = await authorizeAccount();
  const url = `${apiUrl}/b2api/v2/b2_list_file_names`;

  const params = {
    bucketId: process.env.S3_BUCKET_ID,
    maxFileCount: 10000,
  };

  const headers = {
    Authorization: authorizationToken,
  };

  let response = await axios.post(url, params, { headers });
  response = response.data.files.map(file => ({
    ...file,
    metadata: JSON.parse(file.fileInfo.v1),
  }));

  return response;
}

let account;
async function authorizeAccount() {
  if (account) {
    return account;
  }

  const url = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account';

  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${process.env.S3_ACCESS_KEY_ID}:${process.env.S3_SECRET_ACCESS_KEY}`,
    ).toString('base64')}`,
  };

  const response = await axios.get(url, { headers });

  account = {
    authorizationToken: response.data.authorizationToken,
    apiUrl: response.data.apiUrl,
  };

  return account;
}

function createS3Client() {
  return new S3Client({
    endpoint: `https://${process.env.S3_DOMAIN}`,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'eu-central-003',
  });
}
