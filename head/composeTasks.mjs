import { getPureItems, getAllImageIds } from '../lib/database.mjs';
import chalk from 'chalk';
import { shuffle } from '../lib/utils.mjs';
import config from '../config.mjs';
import { cachedImageFilenameFromRemoteURL, cachedImageURLfromRemoteURL, listObjects } from '../lib/storage.mjs';
import dotenv from 'dotenv';

dotenv.config();

export async function composeTasks(client) {
  let pureItemOptions = client ? { where: { client } } : {};
  let pureItems = await getPureItems(pureItemOptions);
  // let tasks = await downloadImageTasks(pureItems);
  let tasks = await analyzeImageTasks(pureItems);
  // let tasks = await renderImageTasks(pureItems);
  shuffle(tasks);
  return tasks;
}

async function renderImageTasks(pureItems) {
  let tasks = [];
  pureItems.forEach(({ remoteImages }) => {
    remoteImages.forEach((url, index) => {
      if (index != 0) {
        return;
      }
      let extension = url.split('.').pop();
      let cachedImageFilename = `${btoa(url)}.${extension}`;

      tasks.push({
        task: 'renderImage',
        taskData: { },
      });
    });
  });
  return tasks;
}


async function downloadImageTasks(pureItems) {
  let tasks = [];
  // listObjects takes a while on high-latency internet, you can remove it for testing
  let downloadedImages = new Set(await listObjects(process.env.S3_IMAGECACHE_BUCKET_NAME));
  pureItems.forEach(({ remoteImages }) => {
    remoteImages.forEach((url) => {
      let destinationFilename = cachedImageFilenameFromRemoteURL(url);

      if (downloadedImages.has(destinationFilename)) {
        return;
      }

      tasks.push({
        task: 'downloadImage',
        taskData: {
          remoteUrl: url,
          destinationFilename,
        },
      });
    });
  });
  return tasks;
}

async function analyzeImageTasks(pureItems) {
  let tasks = [];
  let completedImages = await getAllImageIds();
  pureItems.forEach(({ id: pureItemId, remoteImages }) => {
    remoteImages.forEach((url, index) => {
      if (completedImages.has(url)) {
        return;
      }

      let downloadURL = cachedImageURLfromRemoteURL(url);

      tasks.push({
        task: 'analyzeImage',
        taskData: {
          keyURL: url,
          pureItemId,
          downloadURL,
          index,
        },
      });
    });
  });
  return tasks;
}