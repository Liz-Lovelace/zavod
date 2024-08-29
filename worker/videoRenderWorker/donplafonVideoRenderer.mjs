import sharp from 'sharp';
import { multipleNoun } from '../../lib/utils.mjs';
import fs from 'fs/promises';
import { propPrecedenceFromCategory, prettifyCategoryTitle } from '../donplafonCategories.mjs';
import config from '../../config.mjs';
import { sleep } from '../../lib/utils.mjs';
import { uploadBuffer } from '../../lib/storage.mjs';
import dotenv from 'dotenv';
import { render } from './render.mjs';

dotenv.config();

export async function videoRenderWorker( item ) {
  let [category, subcategory] = item.rawProperties.categoryStack;
  let propPrecedence = propPrecedenceFromCategory(subcategory, category);
  let flavorTexts = pickProps(item.rawProperties, propPrecedence)
  flavorTexts = flavorTexts.map(({propName, propValue}) => formatProp(propName, propValue))

  let props = {
    title: prettyTitle(item.rawProperties['Наименование']),
    flavorTexts,
    images: arrangeImages(item.images),
  };

  let outputVideo = await render(props)

  /*
  await render('testVideo', {
    ...item,
    images: arrangeImages(item.images),

    itemInfo: `${item.images.length} images ID ${item.id}`,
    flavorTexts: getInterestingParams(item),
    title: prettyTitle(item.name),
  });
  */

  if (!config.debugVideoRenderer) {
    await uploadBuffer(process.env.S3_VIDEORENDER_BUCKET_NAME, item.uploadFilename, outputVideo.buffer);
  }
  else {
    await fs.writeFile(new URL('./testOutput.mp4', import.meta.url).pathname, outputVideo.buffer);
  }

  return {};
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

function arrangeImages(images) {
  images.sort((a, b) => a.index - b.index)
  images = images.map(image => image.downloadURL)

  let maxLength = 6;
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

function pickProps(props, propPrecedence) {
  let pickedProps = [];

  propPrecedence.forEach(propName => {
    let isSet = Boolean(props[propName]);

    let otherSkip = propName == 'Наличие выключателя' && props[propName] == 'Нет';
    let otherSkip2 = propName == 'Страна' && props[propName] == 'Китай';

    if (isSet && !otherSkip && !otherSkip2) {
      pickedProps.push({
        propName,
        propValue: props[propName],
      });
    }
  });

  return pickedProps;
}


function formatProp(propKey, propValue) {
  if (propKey == 'Тип крепления') {
    return `${propKey}: ${propValue}`;
  }
  else if (propKey == 'Наличие выключателя') {
    if (propValue == 'Да') {
      return 'С выключателем';
    }
    else {
      return 'Без выключателя';
    }
  }
  else if (propKey == 'Пульт ДУ') {
    return propKey;
  }
  else if (propKey == 'Лампы в комплекте') {
    return propKey;
  }
  else if (propKey == 'Площадь освещения') {
    return `${propKey} ${propValue}м²`;
  }
  else if (propKey == 'Цоколь') {
    return `${propKey} ${propValue}`;
  }
  else if (propKey == 'Общая мощность, W') {
    return `Общая мощность: ${propValue}W`;
  }
  else if (propKey == 'Страна') {
    return propValue;
  }
  else if (propKey == 'Гарантия') {
    return `${propKey} ${propValue}`;
  }
  else if (propKey == 'Количество ламп') {
    return `${propValue} ${multipleNoun(parseInt(propValue), 'лампа', 'лампы', 'ламп')}`;
  }
  else if (propKey == 'Длина подвеса в мм') {
    return `Длина подвеса ${propValue}мм`;
  }
  else if (propKey == 'Для натяжных потолков') {
    return propKey;
  }
  else if (propKey == 'Степень защиты (IP)') {
    return `Степень защиты IP${propValue}`;
  }
  else if (propKey == 'Для низких потолков') {
    return propKey;
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
    return lookup[propValue];
  }
  else if (propKey == 'Цветовая температура') {
    return `Температура ${propValue}`;
  }
  else if (propKey == 'Световой поток, лм') {
    return `${propValue}`;
  }
  else if (propKey == 'Возможность подключения диммера') {
    return 'Подходит к диммеру';
  }
  else if (propKey == 'Диаметр врезного отверстия, мм') {
    `Врезное отверстие ${propValue}мм`;
  }
  else if (propKey == 'Тип шинопровода') {
    return `${propValue} шинопровод`;
  }
  else if (propKey == 'Количество фаз') {
    return propValue;
  }
  else {
    console.log('unknown prop flavortext!!', propKey, propValue)
    return `${propKey}: ${propValue}`;
  }
}
