import sharp from 'sharp';
import fs from 'fs/promises';
import propPrecedenceByCategory from './propPrecedence.mjs';
import config from '../../config.mjs';
import { sleep } from '../../lib/utils.mjs';
import { uploadBuffer } from '../../lib/storage.mjs';
import dotenv from 'dotenv';

dotenv.config();

let patchNameFromProp = {
  'Лампы в комплекте': 'bulb-included',
  'Для низких потолков': 'low-ceiling',
  'Наличие выключателя': 'light-switch',
  'Площадь освещения': 'illumination-area',
  'Общая мощность, W': 'wattage',
  'Расположение=На стену': 'wall-mount',
  'Для натяжных потолков': 'stretchy-ceiling-mount',
  'Диаметр врезного отверстия, мм': 'hole-diameter',
  'Цоколь': 'bulb-size',
  'Пульт ДУ': 'remote-control',
  'Степень защиты (IP)': 'protection',
  'Степень защиты': 'protection',
  'Световой поток, лм': 'lumens',
  // '???':"title",
};

let otherAssets;
let patches;

await startup();

export async function imageRenderWorker({ uploadFilename, downloadURL, averageEdgeColor, pureItem }) {
  const sourceImageBuffer = await fetch(downloadURL).then(res => res.arrayBuffer());
  // const sourceImageBuffer = await fs.readFile(new URL('./testSource.jpg', import.meta.url));

  // todo: refactor
  let category = pureItem.rawProperties.categoryStack[0];
  let subcategory = pureItem.rawProperties.categoryStack[1];
  let propPrecedence = propPrecedenceByCategory[subcategory] ||  propPrecedenceByCategory[category];
  if (!propPrecedence) {
    return {};
  }

  let props = pickProps(pureItem.rawProperties, propPrecedence);

  let chosenPatches = patchesFromProps(props, patches);

  let outputImageBuffer = await renderImage({
    sourceImageBuffer,
    patches: chosenPatches,
    backgroundColor: { r: averageEdgeColor[0], g: averageEdgeColor[1], b: averageEdgeColor[2] },
    width: 1080,
    height: 1080,
    // todo: padding can be determined by bounding box
    padding: 100,
  });

  if (!config.debugImageRenderer) {
    await uploadBuffer(process.env.S3_IMAGERENDER_BUCKET_NAME, uploadFilename, outputImageBuffer);
  }
  else {
    await fs.writeFile(new URL('./testOutput.jpeg', import.meta.url).pathname, outputImageBuffer);
  }

  return {};
}

async function startup() {
  patches = await loadPatches();
  otherAssets = {
    frame: await fs.readFile(new URL('./frame.svg', import.meta.url)),
  };
}

async function renderImage({ sourceImageBuffer, backgroundColor, padding, width: outWidth, height: outHeight, patches }) {
  let frameImg = await sharp(otherAssets.frame).resize(outHeight, outHeight).toBuffer();

  patches = positionPatches(patches, outWidth, outHeight);

  return await sharp(sourceImageBuffer)
    .resize({
      width: outWidth - padding * 2,
      height: outHeight - padding * 2,
      fit: sharp.fit.contain,
      background: backgroundColor,
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: backgroundColor,
    })
    .composite([
      { input: frameImg },
      ...patches,
    ])
    .jpeg()
    .toBuffer();
}

function positionPatches(patches, outWidth, outHeight) {
  patches = patches
    .slice(0, 4)
    .sort((p1, p2) => p2.metadata.width - p1.metadata.width);

  let offsets = {
    tl: { h: 40, v: 120 },
    bl: { h: 40, v: -200 },
    br: { h: -40, v: -40 },
  };

  let positions = {
    1: ['tl'],
    2: ['bl', 'br'],
    3: ['bl', 'br', 'br'],
    4: ['tl', 'bl', 'br', 'br'],
    5: ['tl', 'bl', 'br', 'bl', 'br'],
    6: ['tl', 'bl', 'br', 'bl', 'br', 'br'],
  }[patches.length];

  let compositeConfigs = [];
  for (let i = 0; i < patches.length; i++) {
    let patch = patches[i];
    let position = positions[i];

    let left = offsets[position].h;
    let top = offsets[position].v;

    if (position[0] == 'b') {
      top += outHeight - patch.metadata.height;
      offsets[position].v -= patch.metadata.height;
    }
    else {
      offsets[position].v += patch.metadata.height;
    }

    if (position[1] == 'r') {
      left += outWidth - patch.metadata.width;
    }

    compositeConfigs.push({
      input: patch.buffer,
      left: left,
      top: top,
    });
  }
  return compositeConfigs;
}

function pickProps(props, propPrecedence) {
  let pickedProps = [];
  let pickedPropNames = new Set();

  propPrecedence = propPrecedence.concat(Object.keys(props));

  propPrecedence.forEach(propName => {
    let isSet = Boolean(props[propName]);
    let isRenderable = Object.keys(patchNameFromProp).includes(propName);
    let isUnique = !pickedPropNames.has(propName);
    if (isSet && isRenderable && isUnique) {
      pickedProps.push([propName, props[propName]]);
      pickedPropNames.add(propName);
    }
  });

  return pickedProps;
}

function patchesFromProps(props, patches) {
  let chosenPatches = [];
  for (let [propKey, propValue] of props) {
    if (propKey == 'Расположение') {
      propKey += `=${propValue}`;
    }
    let patch = patches.find(p => p.name == patchNameFromProp[propKey]);
    if (!patch) {
      throw `Patch not found for prop ${propKey}`;
    }
    chosenPatches.push(patch);
  }
  return chosenPatches;
}

async function loadPatches() {
  const patchesDir = new URL('./patches/', import.meta.url);
  const patchFiles = await fs.readdir(patchesDir);

  const patches = [];

  for (const file of patchFiles) {
    const patchBuffer = await fs.readFile(new URL(file, patchesDir));
    let patchName = file.split('.')[0];
    let sharpObj = sharp(patchBuffer);
    let patch = {
      sharp: sharpObj,
      metadata: await sharpObj.metadata(),
      buffer: await sharpObj.toBuffer(),
      name: patchName,
    };
    patch.metadata.height -= 50;
    patch.metadata.width -= 50;

    patches.push(patch);
  }

  return patches;
}
