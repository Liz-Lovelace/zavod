import sharp from 'sharp';
import fs from 'fs/promises';
import { propPrecedenceFromCategory, prettifyCategoryTitle } from './donplafonCategories.mjs';
import config from '../../config.mjs';
import { sleep } from '../../lib/utils.mjs';
import { uploadBuffer } from '../../lib/storage.mjs';
import dotenv from 'dotenv';
import { patchNameFromProp, patchesFromProps, getPatch } from './donplafonPatches.mjs';
import { getPlaque } from './patchPlaque.mjs';

dotenv.config();

let otherAssets;

await startup();

export async function imageRenderWorker({ uploadFilename, downloadURL, averageEdgeColor, pureItem, medianEdgeBrightness}) {
  const sourceImageBuffer = await fetch(downloadURL).then(res => res.arrayBuffer());
  // const sourceImageBuffer = await fs.readFile(new URL('./testSource.jpg', import.meta.url));

  let [category, subcategory] = pureItem.rawProperties.categoryStack;
  let propPrecedence = propPrecedenceFromCategory(subcategory, category)
  let categoryNamePatch = {
    patch: await getPatch('category', [prettifyCategoryTitle(subcategory)]),
    name: 'category',
  }

  let props = pickProps(pureItem.rawProperties, propPrecedence);
  // props = [['Цоколь', 'GX53includesbulbs'], ['Цоколь', 'GX53']]
  // props = [['Количество ламп', '1'], ['Количество ламп', '12'],]
  // props = [['Световой поток, лм', '300'], ['Цоколь', 'GX53includesbulbs'],['Степень защиты (IP)', 'IP32']]
  // props = [['Световой поток, лм', '300'], ['Световой поток, лм', '3000'],]
  // props = [['Гарантия', '5 лет'],['Гарантия', '24 месяца'], ['Гарантия', '2,5 года']]
  // props = [['Страна', 'Италия']]
  // props = [['Цвет свечения', 'Холодный белый']]
  // props = [['Площадь освещения', '24'], ['Площадь освещения', '240'], ['Площадь освещения', '2']]
  // Нейтральный белый, Теплый белый, От теплого до холодного, От теплого до нейтрального, Холодный белый, RGB, От нейтрального до холодного

  let chosenPatches = await patchesFromProps(props);

  let backgroundColor = (medianEdgeBrightness == 255 || medianEdgeBrightness == 0) ?
    { r: medianEdgeBrightness, g: medianEdgeBrightness, b: medianEdgeBrightness }
    : { r: averageEdgeColor[0], g: averageEdgeColor[1], b: averageEdgeColor[2] }

  let outputImageBuffer = await renderImage({
    sourceImageBuffer,
    patches: chosenPatches,
    topLeftPatch: categoryNamePatch,
    backgroundColor,
    width: 1080,
    height: 1080,
    // todo: padding can be determined by bounding box
    padding: 100,
  });

  if (!config.debugImageRenderer) {
    await uploadBuffer(process.env.S3_IMAGERENDER_BUCKET_NAME, uploadFilename, outputImageBuffer);
  } else {
    await fs.writeFile(new URL('./testOutput.jpeg', import.meta.url).pathname, outputImageBuffer);
  }

  return {};
}

async function startup() {
  otherAssets = {
    frame: await fs.readFile(new URL('./overlay.png', import.meta.url)),
  };
}

function pickProps(props, propPrecedence) {
  let pickedProps = [];

  propPrecedence.forEach(propName => {
    let isSet = Boolean(props[propName]);
    let isRenderable = Object.keys(patchNameFromProp).includes(propName);

    let otherSkip = propName == 'Наличие выключателя' && props[propName] == 'Нет'

    if (propName == 'Цоколь') {
      if (Object.keys(props).includes('Лампы в комплекте')) {
        props[propName] += 'includesbulbs'
      }
    } 

    if (isSet && isRenderable && !otherSkip) {
      pickedProps.push([propName, props[propName]]);
    }
  });

  return pickedProps;
}

async function renderImage({ sourceImageBuffer, backgroundColor, padding, width: outWidth, height: outHeight, patches, topLeftPatch }) {
  let frameImg = await sharp(otherAssets.frame).resize(outHeight, outHeight).toBuffer();

  patches = await positionPatches(patches, topLeftPatch, outWidth, outHeight);

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
      { input: frameImg, blend: 'multiply'},
      ...patches,
    ])
    .jpeg()
    .toBuffer();
}

async function positionPatches(freePatches, topLeftPatch, outWidth, outHeight) {
  freePatches = freePatches
    .slice(0, 3)
    .sort((p1, p2) => p2.patch.metadata.width - p1.patch.metadata.width);

  let patches = [topLeftPatch].concat(freePatches)

  let offsets = {
    tl: { h: 40, v: 60 },
    tr: { h: -40, v: 220 },
    bl: { h: 40, v: -200 },
    br: { h: -40, v: -40 },
  };

  let positions = {
    2: ['tl'],
    2: ['tl', 'bl'],
    3: ['tl', 'bl', 'tr'],
    4: ['tl', 'bl', 'tr', 'br'],
  }[patches.length];

  let compositeConfigs = [];
  for (let i = 0; i < patches.length; i++) {
    let patch = patches[i].patch;
    let patchName = patches[i].name;
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

    if (!['lumens', 'protection'].includes(patchName)) {
      let plaquePadding = 60;
      compositeConfigs.push({
        input: await (await getPlaque({
          width: patch.metadata.width + plaquePadding * 2,
          height: patch.metadata.height + plaquePadding,
          flip: position[1] == 'r',
        })).toBuffer(),
        left: position[1] == 'l' ? 0 : left - plaquePadding,
        top: top - plaquePadding / 2,
      })
    }


    compositeConfigs.push({
      input: patch.buffer,
      left, 
      top,
    });
  }


  return compositeConfigs;
}

