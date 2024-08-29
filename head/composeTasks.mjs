import { getPureItems, getAllImageIds, getImages, unpackagePureItem } from '../lib/database.mjs';
import chalk from 'chalk';
import { shuffle } from '../lib/utils.mjs';
import config from '../config.mjs';
import { cachedImageFilenameFromRemoteURL, cachedImageURLfromRemoteURL, listObjects, renderedImageFilename, renderedImageURLfromFilename } from '../lib/storage.mjs';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

export async function composeTasks(client) {
  let pureItemsOptions = client ? { where: { client } } : {};
  let pureItems = await getPureItems(pureItemsOptions);
  // let tasks = await downloadImageTasks(pureItems);
  let tasks = await analyzeImageTasks(pureItems);

  /*
  let imagesOptions = client ? { where: {
    pureItem: { client: client },
    index: 0,
  } } : {};

  let images = await getImages({
    ...imagesOptions,
    include: { pureItem: true },
  });
  images.forEach(image => {
    image.pureItem = unpackagePureItem(image.pureItem);
  });
  images = images.filter(image => image.medianEdgeBrightness == 255);
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
    let downloadURL = cachedImageURLfromRemoteURL(image.url);
    image.pureItem.shops.forEach(({ shop, ozonId }) => {
      let shopName = {
        '106397': 'homedecor',
        '106692': 'roomdecor',
        '63614':  'lampochki',
        '35923':  'donplafon',
      }[shop];

      if (shopName == 'lampochki') {
        return;
      }
      // if (shopName == 'roomdecor') return

      if (!['roomdecor', 'lampochki'].includes(shopName)) {
        return;
      }

      let uploadFilename = renderedImageFilename(shop, image.pureItem.offerId, ozonId, image.url);

      if (renderedImages.has(uploadFilename)) {
        return;
      }

      tasks.push({
        task: 'renderImage',
        taskData: {
          ...image,
          downloadURL,
          uploadFilename,
          shop: shopName,
        },
      });
    });
  });
  return tasks;
}

async function createClientJson(images) {
  let json = [];
  images.forEach(img => {
    let parts = img.split('-');
    let shop = parts[0];
    let offerId = parts[1];
    let ozonId = parts[2].split('.')[0];
    let seoURL = renderedImageURLfromFilename(img);
    json.push({
      'ID элемента': offerId,
      'Ozon Product ID': ozonId,
      shopId: shop,
      seoURL,
    });
  });
  console.log('items in json:', json.length);

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
