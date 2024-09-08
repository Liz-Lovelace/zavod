import fs from 'fs/promises';
import config from '../../config.mjs';
import { sleep } from '../../lib/utils.mjs';
import { uploadBuffer } from '../../lib/storage.mjs';
import dotenv from 'dotenv';
import { render } from './render.mjs';

dotenv.config();

export async function imageRenderWorker({ shop, uploadFilename, downloadURL, averageEdgeColor, pureItem, medianEdgeBrightness }) {
  let outputImage = await render({
    downloadURL,
  })

  if (!config.debugImageRenderer) {
    await uploadBuffer(process.env.S3_IMAGERENDER_BUCKET_NAME, uploadFilename, outputImage.buffer);
  }
  else {
    await fs.writeFile(new URL('./testOutput.jpeg', import.meta.url).pathname, outputImage.buffer);
  }

  return {};
}

