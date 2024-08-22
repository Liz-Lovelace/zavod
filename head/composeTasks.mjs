import { getPureItems, getAllImageIds, getImages, unpackagePureItem } from '../lib/database.mjs';
import chalk from 'chalk';
import { shuffle } from '../lib/utils.mjs';
import config from '../config.mjs';
import { cachedImageFilenameFromRemoteURL, cachedImageURLfromRemoteURL, listObjects, renderedImageFilename } from '../lib/storage.mjs';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

export async function composeTasks(client) {
  let pureItemsOptions = client ? { where: { client } } : {};
  let pureItems = await getPureItems(pureItemsOptions);
  let tasks = await downloadImageTasks(pureItems);
  // let tasks = await analyzeImageTasks(pureItems);

  /*
  let imagesOptions = client ? { where: {
    pureItem: { client: client },
    index: 0,
  } } : {};

  let images = await getImages({
    ...imagesOptions,
    include: { pureItem: true },
  });
  images = images.filter(image => image.pureItem.applicableDesigns.includes('63614'))
  images = images.filter(image => image.medianEdgeBrightness == 255)
  let tasks = await renderImageTasks(images);
  */

  shuffle(tasks);
  return tasks;
}

async function renderImageTasks(images) {
  let tasks = [];
  // listObjects takes a while on high-latency internet, you can remove it for testing
  let renderedImages = new Set(await listObjects(process.env.S3_IMAGERENDER_BUCKET_NAME));
  // temporary shitty thing
  await createClientJson(renderedImages);
  images.forEach((image) => {
    image.pureItem = unpackagePureItem(image.pureItem);

    let downloadURL = cachedImageURLfromRemoteURL(image.url);
    let uploadFilename = renderedImageFilename(image.pureItem.id, image.url);

    if (renderedImages.has(uploadFilename)) {
      return;
    }

    tasks.push({
      task: 'renderImage',
      taskData: {
        ...image,
        downloadURL,
        uploadFilename,
      },
    });
  });
  return tasks;
}

async function createClientJson(images) {
  let json = [];
  images.forEach(img => {
    let parts = img.split('-0000-');
    let id = parts[0].slice(10);
    let originalURL = atob(parts[1].split('.')[0]);
    let seoURL = `https://rendered-images.ams1.vultrobjects.com/${img.replaceAll(' ', '%20')}`;
    json.push({ id, originalURL, seoURL });
  });
  console.log(json.length);

  await fs.writeFile('./SEOimages.json', JSON.stringify(json));
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
