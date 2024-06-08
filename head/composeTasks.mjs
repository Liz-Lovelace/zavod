import { getPureItems, saveImageAnalysis, getImages, getAllImageIds } from '../lib/database.mjs';
import chalk from 'chalk';
import { composeAnalytics } from './workerPerformanceAnalytics.mjs';
import { shuffle } from '../lib/utils.mjs';
import config from '../config.mjs';
import { cachedImageURLfromRemoteURL, listObjects } from '../lib/storage.mjs';
import dotenv from 'dotenv';

dotenv.config();

export async function composeTasks(client) {
  let pureItemOptions = client ? {where: {client}} : {}
  let pureItems = await getPureItems(pureItemOptions);
  // let tasks = await downloadImageTasks(pureItems);
  let tasks = await analyzeImageTasks(pureItems);
  shuffle(tasks);
  return tasks;
}

async function downloadImageTasks(pureItems) {
  let tasks = [];
  // listObjects takes a while on high-latency internet, you can remove it for testing
  let downloadedImages = new Set(await listObjects(process.env.S3_IMAGECACHE_BUCKET_NAME))
  pureItems.forEach(({ remoteImages }) => {
    remoteImages.forEach((url, index) => {
      let extension = url.split('.').pop();
      let destinationFilename = `${btoa(url)}.${extension}`;

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
  // todo: this whole dance would probably be done cleaner in database.mjs
  let completedImages = await getAllImageIds();
  pureItems.forEach(({ id: pureItemId, remoteImages }) => {
    remoteImages.forEach((url, index) => {
      if (completedImages.has(url)) {
        return;
      }

      let downloadURL = cachedImageURLfromRemoteURL(url)

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