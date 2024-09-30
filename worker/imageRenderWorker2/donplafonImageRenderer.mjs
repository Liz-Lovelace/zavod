import fs from 'fs/promises';
import config from '../../config.mjs';
import { sleep } from '../../lib/utils.mjs';
import { uploadBuffer } from '../../lib/storage.mjs';
import dotenv from 'dotenv';
import { render } from './render.mjs';
import { propPrecedenceFromCategory, prettifyCategoryTitle } from '../donplafonCategories.mjs';

dotenv.config();

let patchNameFromProp = {
  'Пульт ДУ':'RemoteControlled',
  'Количество ламп':'LampCount',
  'Наличие выключателя':'Switch',
  'Площадь освещения':'Area',
  'Цоколь':'BulbSize',
  'Цокольincludesbulbs':'BulbIncludedSize',
  'Общая мощность, W':'Power',
  'Гарантия':'Guarantee',
  'Длина подвеса в мм':'WireLength',
  'Для натяжных потолков':'StretchyCeiling',
  'Для низких потолков':'LowCeiling',
  'Световой поток, лм':'Lumens',
  'Степень защиты (IP)':'Protection',
  'Страна':'Country',
  // 'Цвет свечения':'ColorTone', disabled because it's always in pair with temperature
  'Тип крепления':'Attachment',
  'Цветовая температура':'ColorTemperature',
  'Возможность подключения диммера':'Dimmer',
  'Диаметр врезного отверстия, мм': 'Diameter',
  'Тип шинопровода':'Bus',
  'Количество фаз':'Phases',
};


export async function imageRenderWorker({ shop, uploadFilename, downloadURL, averageEdgeColor, pureItem, medianEdgeBrightness }) {
  let [category, subcategory] = pureItem.rawProperties.categoryStack;
  let propPrecedence = propPrecedenceFromCategory(subcategory, category);

  let props = pickProps(pureItem.rawProperties, propPrecedence);

  let patches = props.map(({propName, propValue}) => ({
    patchName: patchNameFromProp[propName],
    patchData: propValue,
  }))

  let categoryTitle = prettifyCategoryTitle(subcategory)

  /*
  if (!patches.some((p => p.patchName == 'LowCeiling'))){
    return {}
  }
  */

  let outputImage = await render({
    downloadURL,
    patches,
    categoryTitle,
    averageEdgeColor,
    medianEdgeBrightness,
    shop,
  })

  if (!config.debugImageRenderer) {
    await uploadBuffer(process.env.S3_IMAGERENDER_BUCKET_NAME, uploadFilename, outputImage.buffer);
  }
  else {
    await fs.writeFile(new URL('./testOutput.jpeg', import.meta.url).pathname, outputImage.buffer);
  }

  return {};
}


function pickProps(props, propPrecedence) {
  let pickedProps = [];

  propPrecedence.forEach(propName => {
    let isSet = Boolean(props[propName]);
    let isRenderable = Object.keys(patchNameFromProp).includes(propName);

    let otherSkip = propName == 'Наличие выключателя' && props[propName] == 'Нет';
    let otherSkip2 = propName == 'Страна' && props[propName] == 'Китай';
    let additions = '';
    if (propName && propName == 'Цоколь') {
      if (Object.keys(props).includes('Лампы в комплекте')) {
        additions += 'includesbulbs';
      }
    }

    if (isSet && isRenderable && !otherSkip && !otherSkip2) {
      pickedProps.push({
        propName: propName + additions,
        propValue: props[propName],
      });
    }
  });

  return pickedProps;
}

