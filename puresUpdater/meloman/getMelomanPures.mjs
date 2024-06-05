import { download } from '../../lib/utils.mjs';
import chalk from 'chalk';
import xml2js from 'xml2js';
import FS from 'fs';
import purifyItem from './itemsPurifier.mjs';

const fs = {
  ...FS.promises,
  existsSync: FS.existsSync,
};

const lastFeedIndex = 95;
const toyFeedIndex = 95;
const bookFeedIndex = 6;
const ruralFeedIndex = 13;

export default async function* getPureItems() {
  let allFeeds = getAllFeeds();
  for (let { path, URL } of allFeeds) {
    if (!fs.existsSync(path)) {
      await download(URL, path);
    }
  }

  // const xmlString = await fs.readFile(feedPath, 'utf-8');
  const parser = new xml2js.Parser({
    explicitArray: false,
  });
  let feedPath = getFeedPath(toyFeedIndex);
  let offerXMLs = await getOfferXMLs(feedPath);
  for (let offer of offerXMLs) {
    let rawItem = await parser.parseStringPromise(offer);
    rawItem = rawItem.item;
    let pureItem = purifyItem(rawItem);
    yield pureItem;
  }
}

async function getOfferXMLs(feedPath) {
  const xmlString = await fs.readFile(feedPath, 'utf-8');
  let offers = xmlString.match(/<item>.*?<\/item>/gs);
  return offers;
}

function getAllFeeds() {
  let allFeeds = [];
  let skipIndexes = [41, 73, 68, 37, 49, 29, 52, 17, 55, 19, 1, 60, 33, 74, 7, 4, 50, 11, 2, 20, 76, 51, 82, 36, 46, 21, 35, 65, 3, 23, 81, 72, 48, 16, 71, 80, 32, 31, 5, 70, 22, 8, 57, 15, 27, 25, 18, 75, 78, 39, 43, 9, 28, 34, 24, 40, 47, 26, 42, 14, 54, 45, 44, 79, 38, 30, 10, 58, 94];
  // csv
  // skipIndexes = skipIndexes.concat([59, 61, 62, 63, 64, 66, 67, 69, 77, 83, 84, 85, 86, 87, 91])
  for (let index = 1; index <= lastFeedIndex; index++) {
    if (!skipIndexes.includes(index)) {
      allFeeds.push({
        index,
        path: getFeedPath(index),
        URL: `https://www.meloman.kz/amfeed/feed/download?id=${index}`,
      });
    }
  }
  return allFeeds;
}

function getFeedPath(feedIndex) {
  return new URL(`file:./materials/${feedIndex}.xml`, import.meta.url);
}