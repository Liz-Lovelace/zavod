import { parse } from 'csv-parse/sync';
import { download } from '../../lib/utils.mjs';
import FS from 'fs';
import purifyItem from './itemsPurifier.mjs';

const fs = {
  ...FS.promises,
  existsSync: FS.existsSync,
};

const feedPath = new URL('file:./materials/propertyDb.csv', import.meta.url);

export default async function* getPureItems() {
  if (!fs.existsSync(feedPath)) {
    await download('https://prod-feed.donplafon.ru/catalog_export/csv/production/all.csv', feedPath);
  }

  let offerIdToShops = await getOfferIdToShops();

  let propsLookup = await csvToIdDict(feedPath, 'Артикул');
  console.log(Object.keys(propsLookup).length, 'donplafon items total, but we\'ll only be looking at the ones in shops');

  let mergedItems = {};
  for (let offerId of Object.keys(offerIdToShops)) {
    let propItem = propsLookup[offerId];

    if (mergedItems[offerId] || !propItem) {
      continue;
    }

    let pureItem = purifyItem({
      ...propItem,
      offerId,
      shopIds: offerIdToShops[offerId],
    });

    yield pureItem;
  }
}

async function getOfferIdToShops() {
  let offerIdToShops = {};
  for (let shopId of [106397, 106692, 35923, 63614]) {
    let path = new URL(`file:./materials/shop-${shopId}.csv`, import.meta.url);
    let shopItems = await readCsv(path);
    for (let shopItem of shopItems) {
      shopItem.shopId = shopId;
      let offerId = shopItem['﻿"Артикул"'].slice(1);
      offerIdToShops[offerId] = (offerIdToShops[offerId] || []).concat(shopId);
    }
  }
  return offerIdToShops;
}

async function csvToIdDict(csvPath, idKey) {
  const items = await readCsv(csvPath);
  let dict = {};
  for (let item of items) {
    let offerId = item[idKey];
    dict[offerId] = item;
  }
  return dict;
}

async function readCsv(path) {
  const csvStr = await fs.readFile(path, 'utf-8');
  return parse(csvStr, { columns: true, delimiter: ';', relax_quotes: true });
}