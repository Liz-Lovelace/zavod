import fs from 'fs/promises';
import { render } from './render.mjs';
import { uploadBuffer, listFiles } from '../src/utils/objectStorage.mjs';

main();
async function main() {
  let { items } = await getItems();
  shuffle(items);

  let skippedFiles = []; // await listFiles();
  // skippedFiles = skippedFiles.map(file => file.metadata.itemId);

  let batch = items.filter(item => !skippedFiles.includes(item.id)).slice(0, 100);
  console.log(`Batch size: ${batch.length}`);


  let i = 0;
  for (let item of batch) {
    i++;
    console.log(`beginning render of ID ${item.id}... ${skippedFiles.length + i} / ${items.length}  (${i} / ${batch.length} in batch)`);
    console.time('render');
    try {
      let result = await sendToRender(item);
      // await uploadBuffer(`${item.id}.mp4`, result.buffer, { itemId: item.id });
    }
    catch (err) {
      console.log(`RENDER FAILED for item with ID ${item.id}`);
      console.error(err);
    }
    console.timeEnd('render');
    throw 'awawa';
  }
}

async function sendToRender(item, saveToFile) {
  return await render(item.id, {
    ...item,
    images: arrangeImages(item.images),

    itemInfo: `${item.images.length} images ID ${item.id}`,
    flavorTexts: getInterestingParams(item),
    title: prettyTitle(item.name),
  });
}

async function inspectID(id, raw) {
  let { items, rawItems } = await getItems();
  let item = items.find(i => i.id == id);
  if (!item) {
    console.log(`No item found for ID ${id}`);
    return;
  }
  let rawItem = rawItems.find(i => i['$'].id == id);
  console.log('----------------------------');
  if (raw) {
    console.log(rawItem);
    console.log('--- Pretty V    Raw /\\ ----');
  }
  console.log(item.params.map(param => `${param.paramName}:${' '.repeat(Math.max(1, 25 - param.paramName.length)) }${param.paramValue}`));
  console.log({ ...item, params: 'SEE ABOVE' });
}

async function getItems() {
  let rawItems = await fs.readFile(new URL('file:./lystry.json', import.meta.url)).then(str => JSON.parse(str));
  return {
    rawItems,
    items: rawItems.map(getUsefulInfo),
  };
}

function arrangeImages(images) {
  let maxLength = 5;
  let removeCount = images.length - maxLength;

  if (removeCount > 0) {
    images.pop();
    removeCount--;
  }

  if (removeCount <= 0) {
    return images;
  }

  for (let i = 0; i < removeCount; i++) {
    if (i % 2 == 0) {
      images.splice(1, 1);
    }
    else {
      images.splice(images.length - 2, 1);
    }
  }

  return images;
}



function getInterestingParams(item) {
  let { params, name } = item;
  let strings = [];

  let precedence = ['Место в интерьере', 'Стиль', 'Страна', 'Цвет арматуры'];
  precedence.forEach(key => {
    let val = params.find(p => p.paramName == key);
    if (val && val.paramValue) {
      strings.push(`${key}: ${val.paramValue}`);
    }
  });

  return strings.slice(0, 3);
}

function getUsefulInfo(item) {
  if (item.name.length !== 1 || item.vendor.length !== 1 || item.url.length !== 1) {
    console.log(`received a weird item with id ${item['$'].id}`);
  }

  let info = {
    id: item['$'].id,
    name: item.name[0],
    vendor: item.vendor[0],
    url: item.url[0],
    images: item.picture,
    params: item.param.map(obj => ({
      paramName: obj['$'].name,
      paramValue: obj['_'],
    })),
  };

  Object.values(info).forEach(val => {
    if (!val) {
      console.log(`id [${info.id}] - weird value "${val}"!!`);
    }
  });

  return info;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function prettyTitle(str) {
  let result = str
    .split(' ')
    .filter(piece =>
      !/\d/.test(piece) &&
      !/^[A-Z]+$/.test(piece) &&
      !/[-+]/.test(piece),
    )
    .join(' ');

  if (result.length > 40) {
    let words = result.split(' ');
    while (result.length > 40 && words.length > 0) {
      words.pop();
      result = words.join(' ');
    }
  }

  return result;
}
