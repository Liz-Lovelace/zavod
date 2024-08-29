import { parse } from 'csv-parse/sync';
import { download, sleep } from '../../lib/utils.mjs';
import FS from 'fs';
import purifyItem from './itemsPurifier.mjs';
import Excel from 'exceljs';

const fs = {
  ...FS.promises,
  existsSync: FS.existsSync,
};

const feedPath = new URL('file:./materials/propertyDb.csv', import.meta.url);

export default async function* getPureItems() {
  if (!fs.existsSync(feedPath)) {
    await download('https://prod-feed.donplafon.ru/catalog_export/csv/production/all.csv', feedPath);
  }

  let shopItems = await getShopItems();

  console.log('reading props csv');
  let propsFromId = await csvToIdDict(feedPath, 'ID элемента');

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

 async function getShopItems() {
  let shopItemFromId = {};
  for (let shop of [106397, 106692, 35923, 63614]) {
    let path = new URL(`file:./materials/${shop}.xlsx`, import.meta.url);
    let workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.pathname);
    let worksheet = workbook.getWorksheet(1);
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 1) {
        return; 
      }
      
      let id = row.getCell(1).value;
      let ozonId = row.getCell(3).value;
      
      if (!id || !ozonId) {
        console.log(`broken shop item!`, shop, id, ozonId)
        return;
      }
      
      let shopInfo = {
        shop,
        ozonId,
      };
      
      if (!shopItemFromId[id]) {
        shopItemFromId[id] = [];
      }
      shopItemFromId[id].push(shopInfo);
    });
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
