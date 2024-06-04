import { uploadBuffer } from "../lib/storage.mjs";

export default async function imageDownloadWorker({ remoteUrl, destinationFilename }) {
  const imageBuffer = await fetch(remoteUrl).then(res => res.arrayBuffer());
  await uploadBuffer(process.env.S3_IMAGECACHE_BUCKET_NAME, destinationFilename, imageBuffer)
  return {};
}
