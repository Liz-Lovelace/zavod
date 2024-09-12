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
  /*
  'Световой поток, лм':'lumens',
  'Степень защиты (IP)':'protection',
  'Страна':'country',
  'Цвет свечения':'light-color',
  'Тип крепления':'foo',
  'Цветовая температура':'foo',
  'Возможность подключения диммера':'foo',
  'Диаметр врезного отверстия, мм': 'foo',
  'Тип шинопровода':'foo',
  'Количество фаз':'foo',
  */
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

