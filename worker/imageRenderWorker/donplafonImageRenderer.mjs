import sharp from 'sharp';
import fs from 'fs/promises';
import { propPrecedenceFromCategory, prettifyCategoryTitle } from './donplafonCategories.mjs';
import config from '../../config.mjs';
import { sleep } from '../../lib/utils.mjs';
import { uploadBuffer } from '../../lib/storage.mjs';
import dotenv from 'dotenv';
import { patchNameFromProp, patchFromProp, getPatch } from './donplafonPatches.mjs';

dotenv.config();

let otherAssets;

await startup();

export async function imageRenderWorker({ shop, uploadFilename, downloadURL, averageEdgeColor, pureItem, medianEdgeBrightness }) {
  let [category, subcategory] = pureItem.rawProperties.categoryStack;
  let propPrecedence = propPrecedenceFromCategory(subcategory, category);
  let categoryNamePatch = await patchFromProp({
    propName:'category',
    propValue: prettifyCategoryTitle(subcategory),
    position: 'tl',
    shop,
  });

  let props = pickProps(pureItem.rawProperties, propPrecedence).slice(0, 3);
  // props = [['Цоколь', 'GX53includesbulbs'], ['Цоколь', 'GX53']]
  // props = [['Количество ламп', '1'], ['Количество ламп', '12'],]
  // props = [['Световой поток, лм', '300'], ['Цоколь', 'GX53includesbulbs'],['Степень защиты (IP)', 'IP32']]
  // props = [['Световой поток, лм', '300'], ['Световой поток, лм', '3000'],]
  // props = [['Гарантия', '5 лет'],['Гарантия', '24 месяца'], ['Гарантия', '2,5 года']]
  // props = [['Страна', 'Италия']]
  // props = [['Цвет свечения', 'Холодный белый']]
  // props = [['Площадь освещения', '24'], ['Площадь освещения', '240'], ['Площадь освещения', '2']]
  let chosenPatches = [];
  for (let prop of props) {
    chosenPatches.push(await patchFromProp({
      ...prop,
      position: 'tl',
      shop,
    }));
  }

  chosenPatches = positionPatches(chosenPatches);

  for (let i = 0; i < chosenPatches.length; i++) {
    chosenPatches[i] = await patchFromProp({
      ...chosenPatches[i].prop,
      position: chosenPatches[i].position,
      shop,
    });
  }

  chosenPatches = [categoryNamePatch].concat(chosenPatches);

  let backgroundColor = (medianEdgeBrightness == 255 || medianEdgeBrightness == 0) ?
    { r: medianEdgeBrightness, g: medianEdgeBrightness, b: medianEdgeBrightness }
    : { r: averageEdgeColor[0], g: averageEdgeColor[1], b: averageEdgeColor[2] };

  const sourceImageBuffer = await fetch(downloadURL).then(res => res.arrayBuffer());
  // const sourceImageBuffer = await fs.readFile(new URL('./testSource.jpg', import.meta.url));

  let outputImageBuffer = await renderImage({
    sourceImageBuffer,
    patches: chosenPatches,
    backgroundColor,
    width: 1080,
    height: 1080,
    // todo: padding can be determined by bounding box
    padding: shop == 'lampochki' ? 100 : 150,
    shop,
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
  otherAssets = {
    lampochkiOverlay: await fs.readFile(new URL('./lampochki-overlay.png', import.meta.url)),
    roomdecorOverlay: await fs.readFile(new URL('./roomdecor-overlay.svg', import.meta.url)),
  };
}

function pickProps(props, propPrecedence) {
  let pickedProps = [];

  propPrecedence.forEach(propName => {
    let isSet = Boolean(props[propName]);
    let isRenderable = Object.keys(patchNameFromProp).includes(propName);

    let otherSkip = propName == 'Наличие выключателя' && props[propName] == 'Нет';
    let otherSkip2 = propName == 'Страна' && props[propName] == 'Китай';
    if (propName) {
      if (propName == 'Цоколь') {
        if (Object.keys(props).includes('Лампы в комплекте')) {
          props[propName] += 'includesbulbs';
        }
      }
    }

    if (isSet && isRenderable && !otherSkip && !otherSkip2) {
      pickedProps.push({
        propName,
        propValue: props[propName],
      });
    }
  });

  return pickedProps;
}

async function renderImage({ sourceImageBuffer, backgroundColor, padding, width: outWidth, height: outHeight, patches, shop }) {
  let overlay = {
    'lampochki': otherAssets.lampochkiOverlay,
    'roomdecor': otherAssets.roomdecorOverlay,
  }[shop];
  let overlayImg = await sharp(overlay).resize(outHeight, outHeight).toBuffer();

  patches = await calculatePatchCoordinates(patches, outWidth, outHeight, shop);

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
      { input: overlayImg, blend: 'multiply' },
      ...patches,
    ])
    .jpeg()
    .toBuffer();
}

function positionPatches(patches) {
  patches.sort((p1, p2) => p2.patch.metadata.width - p1.patch.metadata.width);
  let positions = ['bl', 'tr', 'br'];
  patches.forEach((patch, i) => {
    patch.position = positions[i];
  });
  return patches;
}

async function calculatePatchCoordinates(patches, outWidth, outHeight, shop) {
  let offsets = {
    tl: { h: 0, v: 60 },
    tr: { h: 0, v: 220 },
    bl: { h: 0, v: -200 },
    br: { h: 0, v: -40 },
  };

  if (shop == 'roomdecor') {
    offsets.tl.v = 10;
  }

  let compositeConfigs = [];
  for (let i = 0; i < patches.length; i++) {
    let patch = patches[i].patch;
    let patchName = patches[i].name;
    let position = patches[i].position;

    let left = offsets[position].h;
    let top = offsets[position].v;

    if (position[0] == 'b') {
      top += outHeight - patch.metadata.height;
    }

    if (position[1] == 'r') {
      left += outWidth - patch.metadata.width;
    }

    compositeConfigs.push({
      input: patch.buffer,
      left,
      top,
    });
  }


  return compositeConfigs;
}

