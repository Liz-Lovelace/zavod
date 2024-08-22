import Excel from 'exceljs';
import { fileURLToPath } from 'url';

const tablePath = new URL('file:./materials/OZON_ID.xlsx', import.meta.url);


export async function getIdFromOzonIdLookup(propsFromId) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(tablePath.pathname);
  const worksheet = workbook.getWorksheet(1);

  const idFromOzonId = {
    '106397': {},
    '106692': {},
    '35923': {},
    '63614': {},
  };

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const id = row.getCell(1).value;
    if (id.error) {
      return;
    }

    if (row.getCell(5).value) {
      idFromOzonId['106397'][row.getCell(5).value] = id;
    }
    if (row.getCell(6).value) {
      idFromOzonId['106692'][row.getCell(6).value] = id;
    }
    if (row.getCell(4).value) {
      idFromOzonId['63614'][row.getCell(4).value] = id;
    }
  });

  Object.keys(propsFromId).forEach(id => {
    let ozonId = propsFromId[id]['Идентификатор Озон'];
    if (ozonId) {
      idFromOzonId['35923'][ozonId] = id;
    }
  });

  return idFromOzonId;
}
