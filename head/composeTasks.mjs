import { getPureItems, saveImageAnalysis, getImages, getAllImageIds } from '../database.mjs';
import chalk from 'chalk';
import { composeAnalytics } from './workerPerformanceAnalytics.mjs';
import { shuffle } from '../lib/utils.mjs';
import config from '../config.mjs';
import { listObjects } from '../lib/storage.mjs';
import dotenv from 'dotenv';

dotenv.config();

export async function composeTasks() {
  let tasks = await downloadImageTasks();
  shuffle(tasks);
  return tasks;
}

await downloadImageTasks()
async function downloadImageTasks() {
  let tasks = [];
  console.time('got cached images')
  let downloadedImages = new Set(await listObjects(process.env.S3_IMAGECACHE_BUCKET_NAME))
  console.log(downloadedImages)
  console.timeEnd('got cached images')
  let pureItems = await getPureItems({where: {client: 'vamsvet'}});
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

async function analyzeImageTasks() {
  let tasks = [];
  // todo: this whole dance would probably be done cleaner in database.mjs
  let pureItems = await getPureItems();
  let completedImages = await getAllImageIds();
  pureItems.forEach(({ remoteImages }) => {
    remoteImages.forEach((url, index) => {
      if (completedImages.has(url)) {
        return;
      }
  
      tasks.push({
        task: 'analyzeImage',
        taskData: {
          url,
          index,
        },
      });
    });
  });
  return tasks;
}