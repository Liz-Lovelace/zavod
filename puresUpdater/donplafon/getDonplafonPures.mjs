import { parse } from 'csv-parse/sync';
import { download, sleep } from '../../lib/utils.mjs';
import FS from 'fs';
import purifyItem from './itemsPurifier.mjs';
import { getIdFromOzonIdLookup } from './ozonIdLookups.mjs';

const fs = {
  ...FS.promises,
  existsSync: FS.existsSync,
};

const feedPath = new URL('file:./materials/propertyDb.csv', import.meta.url);

export default async function* getPureItems() {
  if (!fs.existsSync(feedPath)) {
    await download('https://prod-feed.donplafon.ru/catalog_export/csv/production/all.csv', feedPath);
  }

  console.log('reading props csv');
  let propsFromId = await csvToIdDict(feedPath, 'ID элемента');
  console.log('composing ozon id lookups');
  let idFromOzonId = await getIdFromOzonIdLookup(propsFromId);
  console.log('matching up items with shop ids');
  let shopItems = await getShopItems(idFromOzonId);

  for (let { id, shops } of shopItems) {
    let props = propsFromId[id];

    if (!props) {
      console.log('props not found for id', id);
      continue;
    }

    let pureItem = purifyItem({
      ...props,
      id,
      shops,
    });

    yield pureItem;
  }
}

async function getShopItems(idFromOzonId) {
  let shopItemFromId = {};
  for (let shop of [106397, 106692, 35923, 63614]) {
    let path = new URL(`file:./materials/${shop}.csv`, import.meta.url);
    let shopItems = await readCsv(path);
    for (let shopItem of shopItems) {
      let ozonId = shopItem['Ozon Product ID'];
      let shopInfo = {
        shop,
        ozonId,
      };
      let id = idFromOzonId[shop][ozonId];
      if (!id) {
        continue;
      }
      if (!shopItemFromId[id]) {
        shopItemFromId[id] = [];
      }
      shopItemFromId[id].push(shopInfo);
    }
  }

  let shopItems = Object.entries(shopItemFromId).map(([id, shops]) => ({ id, shops }));

  return shopItems;
}

async function csvToIdDict(csvPath, idKey) {
  const items = await readCsv(csvPath);
  let dict = {};
  for (let item of items) {
    let ozonId = item[idKey];
    dict[ozonId] = item;
  }
  return dict;
}

async function readCsv(path) {
  const csvStr = await fs.readFile(path, 'utf-8');
  return parse(csvStr, { columns: true, delimiter: ';', relax_quotes: true });
}
