import fs from 'fs/promises';
import sharp from 'sharp';
import { multipleNoun } from '../../lib/utils.mjs';

let patches = loadPatches();

let showDebugOutlines;
// showDebugOutlines = true;

export let patchNameFromProp = {
  'Световой поток, лм':'lumens',
  'Количество ламп':'num-bulbs',
  'Степень защиты (IP)':'protection',
  'Цоколь':'bulb-size',
  'Цоколь includesbulbs':'bulb-included-size',
  'Гарантия':'guarantee',
  'Страна':'country',
  'Цвет свечения':'light-color',
  'Площадь освещения':'area',
  /*
  'Тип крепления':'foo',
  'Наличие выключателя':'foo',
  'Пульт ДУ':'foo',
  'Лампы в комплекте':'foo',
  'Общая мощность, W':'foo',
  'Длина подвеса в мм':'foo',
  'Для натяжных потолков':'foo',
  'Для низких потолков':'foo',
  'Цветовая температура':'foo',
  'Возможность подключения диммера':'foo',
  'Диаметр врезного отверстия, мм': 'foo',
  'Тип шинопровода':'foo',
  'Количество фаз':'foo',
  */
};

export async function patchesFromProps(props) {
  let chosenPatches = [];
  for (let [propKey, propValue] of props) {
    if (propKey == 'Расположение') {
      propKey += `=${propValue}`;
    }
    else if (propKey == 'Цоколь') {
      if (propValue.includes('includesbulbs')) {
        propKey = 'Цоколь includesbulbs';
      }
    }
    let patchText = propToText(propKey, propValue);
    let patch = await getPatch(patchNameFromProp[propKey], patchText);
    if (!patch) {
      throw `Patch not found for prop ${propKey}`;
    }
    chosenPatches.push({
      patch,
      name: patchNameFromProp[propKey],
    });
  }
  return chosenPatches;
}

export async function getPatch(patchName, text) {
  let patchBg = (await patches)[patchName];
  if (patchBg) {
    patchBg = await addTextToPatch(patchName, patchBg, text);
    return sharpToPatch(patchBg);
  }
  else {
    let textPatch = await textBasedPatch(patchName, text);
    return sharpToPatch(textPatch);
  }
}

async function addTextToPatch(patchName, patchBg, text) {
  if (patchName == 'lumens') {
    let lumens = await textBuffer({
      text: text[0],
      width: 140,
      height: 40,
      align: 'center',
    });
    let lm = await textBuffer({
      text: 'лм',
      width: 100,
      height: 35,
      align: 'center',
    });
    patchBg
      .composite([{
        input: lumens.buffer,
        left: 28,
        top: 58,
      }, {
        input: lm.buffer,
        left: 44,
        top: 105,
      }]);
  }
  else if (patchName == 'num-bulbs') {
    let numLamps = await textBuffer({
      text: text[0],
      width: 500,
      height: 38,
    });
    patchBg
      .extend({
        left: numLamps.metadata.width + 15,
        background: '#00000000',
      })
      .composite([{
        input: numLamps.buffer,
        left: 0,
        top: 10,
      }]);
    patchBg = await sharpCopy(patchBg);
  }
  else if (patchName == 'protection') {
    let protectionLevel = await textBuffer({
      text: text[0],
      width: 120,
      height: 45,
      align: 'center',
    });
    patchBg
      .composite([{
        input: protectionLevel.buffer,
        left: 28,
        top: 45,
      }]);
  }
  else if (patchName == 'bulb-size') {
    let bulb = await textBuffer({
      text: text[0],
      width: 220,
      height: 38,
    });
    patchBg
      .extend({
        right: bulb.metadata.width + 25,
        background: '#00000000',
      })
      .composite([{
        input: bulb.buffer,
        left: 65,
        top: 15,
      }]);
    patchBg = await sharpCopy(patchBg);
  }
  else if (patchName == 'bulb-included-size') {
    let bulb = await textBuffer({
      text: text[0],
      width: 220,
      height: 38,
    });
    patchBg.composite([{
      input: bulb.buffer,
      left: 65,
      top: 5,
    }]);
    patchBg = await sharpCopy(patchBg);
  }

  if (showDebugOutlines) {
    patchBg = await debugOutline(patchBg);
  }

  return patchBg;
}

async function textBasedPatch(patchName, text) {
  let patch;

  if (patchName == 'category') {
    let category = await textBuffer({
      text: text[0].toUpperCase(),
      width: 700,
      height: null,
      dpi: 400,
    });
    patch = category.sharp;
  }
  else if (patchName == 'guarantee') {
    let length = await textBuffer({
      text: text[0],
      width: 300,
      height: 50,
    });
    let guarantee = await textBuffer({
      text: 'гарантия',
      width: 180,
      height: 32,
    });
    length.sharp.extend({
      bottom: 40,
      background: '#00000000',
    }).composite([{
      input: guarantee.buffer,
      left: 0,
      top: 60,
    }]);
    patch = await sharpCopy(length.sharp);
  }
  else if (patchName == 'area') {
    let area = await textBuffer({
      text: text[0],
      width: 230,
      height: 42,
      align: 'center',
    });
    let label1 = await textBuffer({
      text: 'Площадь',
      width: 230,
      height: 30,
      align: 'center',
    });
    let label2 = await textBuffer({
      text: 'освещения',
      width: 230,
      height: 32,
      align: 'center',
    });
    label2.sharp.extend({
      top: 88,
      background: '#00000000',
    }).composite([{
      input: label1.buffer,
      left: 0,
      top: 55,
    }, {
      input: area.buffer,
      left: 0,
      top: 0,
    }]);
    patch = await sharpCopy(label2.sharp);
  }
  else {
    let undefinedPatch = await textBuffer({
      text: text[0],
      width: 400,
      height: null,
      dpi: 300,
    });
    patch = undefinedPatch.sharp;
  }

  if (showDebugOutlines) {
    patch = await debugOutline(patch);
  }

  return patch;
}

async function textBuffer({ text, height, width, align = 'none', weight = 'semibold', dpi = null }) {
  let textSharp = sharp({
    text: {
      text: `<span font-weight="${weight}" foreground="#023897">${text}</span>`,
      width,
      height,
      dpi,
      rgba: true,
      font: 'Montserrat',
      align: align == 'center' ? 'center' : undefined,
    } });

  let metadata = await textSharp.metadata();

  if (align == 'center') {
    textSharp = await sharpCopy(textSharp.extend({
      top: Math.round((height - metadata.height) / 2), background: '#00ff00',
      left: Math.round((width - metadata.width) / 2), background: '#00000000',
    }));
    metadata.height = height;
    metadata.width = width;
  }
  else if (align == 'bottom') {
    textSharp = await sharpCopy(textSharp.extend({ top: height - metadata.height, background: '#00000000' }));
    metadata.height = height;
  }

  if (showDebugOutlines) {
    textSharp = await debugOutline(textSharp);
  }

  return sharpToPatch(textSharp);
}

async function loadPatches() {
  const patchesDir = new URL('./patches/', import.meta.url);
  const patchFiles = await fs.readdir(patchesDir);

  let patches = {};

  for (const file of patchFiles) {
    const patchBuffer = await fs.readFile(new URL(file, patchesDir));
    let patchName = file.split('.')[0];
    let sharpObj = sharp(patchBuffer);

    if (showDebugOutlines) {
      sharpObj = await debugOutline(sharpObj);
    }

    patches[patchName] = sharpObj;
  }

  return patches;
}

async function sharpToPatch(sharpObj, name = null) {
  return {
    sharp: sharpObj,
    metadata: await sharpObj.metadata(),
    buffer: await sharpObj.png().toBuffer(),
    name,
  };
}

async function sharpCopy(sharpObj) {
  return sharp(await sharpObj.png().toBuffer());
}

async function debugOutline(sharpObj) {
  return await sharpCopy(sharpObj.extend({
    background: '#ff0000',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
  }));
}

function propToText(propKey, propValue) {
  if (propKey == 'Тип крепления') {
    return [`${propKey}: ${propValue}`];
  }
  else if (propKey == 'Наличие выключателя') {
    if (propValue == 'Да') {
      return ['С выключателем'];
    }
    else {
      return ['Без выключателя'];
    }
  }
  else if (propKey == 'Пульт ДУ') {
    return [propKey];
  }
  else if (propKey == 'Лампы в комплекте') {
    return [propKey];
  }
  else if (propKey == 'Площадь освещения') {
    return [`${propValue}м²`];
  }
  else if (propKey == 'Цоколь') {
    return [propValue];
  }
  else if (propKey == 'Цоколь includesbulbs') {
    return [propValue.replace('includesbulbs', '')];
  }
  else if (propKey == 'Общая мощность, W') {
    return [`Общая мощность: ${propValue}W`];
  }
  else if (propKey == 'Страна') {
    return [propValue];
  }
  else if (propKey == 'Гарантия') {
    return [propValue];
  }
  else if (propKey == 'Количество ламп') {
    return [`${propValue} ${multipleNoun(parseInt(propValue), 'лампа', 'лампы', 'ламп')}`];
  }
  else if (propKey == 'Длина подвеса в мм') {
    return [`Длина подвеса ${propValue}мм`];
  }
  else if (propKey == 'Для натяжных потолков') {
    return [propKey];
  }
  else if (propKey == 'Степень защиты (IP)') {
    return [`IP${propValue}`];
  }
  else if (propKey == 'Для низких потолков') {
    return [propKey];
  }
  else if (propKey == 'Цвет свечения') {
    let lookup = {
      'Нейтральный белый': 'Нейтральный белый свет',
      'Теплый белый': 'Теплый белый свет',
      'От теплого до холодного':'Свет от теплого до холодного',
      'От теплого до нейтрального':'Свет от теплого до нейтрального',
      'Холодный белый': 'Холодный белый свет',
      'RGB': 'RGB',
      'От нейтрального до холодного': 'Свет от нейтрального до холодного',
    };
    if (!lookup[propValue]) {
      throw `light-color not found for ${propValue}`;
    }
    return [lookup[propValue]];
  }
  else if (propKey == 'Цветовая температура') {
    return [`Температура ${propValue}`];
  }
  else if (propKey == 'Световой поток, лм') {
    return [`${propValue}`];
  }
  else if (propKey == 'Возможность подключения диммера') {
    return ['Подходит к диммеру'];
  }
  else if (propKey == 'Диаметр врезного отверстия, мм') {
    `Врезное отверстие ${propValue}мм`;
  }
  else if (propKey == 'Тип шинопровода') {
    return [`${propValue} шинопровод`];
  }
  else if (propKey == 'Количество фаз') {
    return [propValue];
  }
  else {
    return [`!!${propKey}: ${propValue}!!`];
  }
}

