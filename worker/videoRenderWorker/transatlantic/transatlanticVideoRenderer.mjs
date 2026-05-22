import fs from 'fs/promises';
import config from '../../../config.mjs';
import dotenv from 'dotenv';
import { render } from '../render.mjs';

dotenv.config();

transatlanticVideoRenderWorker()
export async function transatlanticVideoRenderWorker( ) {
  let props = {
    images: [{ 
      downloadURL: 'https://basket-04.wbbasket.ru/vol579/part57932/57932653/images/c516x688/10.webp',
      averageEdgeColor: '255|255|255',
      medianEdgeBrightness: 255,
    }, { 
      downloadURL: 'https://basket-04.wbbasket.ru/vol579/part57932/57932653/images/c516x688/11.webp',
      averageEdgeColor: '255|255|255',
      medianEdgeBrightness: 255,
    }, { 
      downloadURL: 'https://basket-04.wbbasket.ru/vol579/part57932/57932653/images/c516x688/12.webp',
      averageEdgeColor: '255|255|255',
      medianEdgeBrightness: 255,
    }, { 
      downloadURL: 'https://basket-04.wbbasket.ru/vol579/part57932/57932653/images/c516x688/13.webp',
      averageEdgeColor: '37|78|60',
      medianEdgeBrightness: 100,
    }, { 
      downloadURL: 'https://basket-04.wbbasket.ru/vol579/part57932/57932653/images/c516x688/14.webp',
      averageEdgeColor: '231|212|220',
      medianEdgeBrightness: 216,
    }, { 
      downloadURL: 'https://basket-04.wbbasket.ru/vol579/part57932/57932653/images/c516x688/15.webp',
      averageEdgeColor: '140|171|199',
      medianEdgeBrightness: 176,
    }],
    title: 'Бальзам для сухих и секущихся волос Восстановление и уход',
    flavorTexts: ['Объем: 200 мл', 'для всех типов кожи', 'Страна: Объединенные Арабские Эмираты', 'Действие: питание, восстановление, увлажнение', 'Срок годности: 3 года'],
    slideImgStyle: {
      width: '120%',
      height: '120%',
    },
  };

  /*
  let props = {
    images: [{ 
      downloadURL: 'https://basket-03.wbbasket.ru/vol406/part40607/40607738/images/big/10.webp',
      averageEdgeColor: '203|203|204',
      medianEdgeBrightness: 200,
    },{ 
      downloadURL: 'https://basket-03.wbbasket.ru/vol406/part40607/40607738/images/big/11.webp',
      averageEdgeColor: '203|203|204',
      medianEdgeBrightness: 200,
    },{ 
      downloadURL: 'https://basket-03.wbbasket.ru/vol406/part40607/40607738/images/big/12.webp',
      averageEdgeColor: '203|203|204',
      medianEdgeBrightness: 200,
    },{ 
      downloadURL: 'https://basket-03.wbbasket.ru/vol406/part40607/40607738/images/big/13.webp',
      averageEdgeColor: '203|203|204',
      medianEdgeBrightness: 200,
    },{ 
      downloadURL: 'https://basket-03.wbbasket.ru/vol406/part40607/40607738/images/big/14.webp',
      averageEdgeColor: '203|203|204',
      medianEdgeBrightness: 200,
    },],
    title: 'Крем для лица ночной 46+',
    flavorTexts: ['Объем: 50 мл', 'для всех типов кожи', 'Страна: Швейцария', 'Действие: омолаживание, увлажнение, лифтинг', 'Срок годности: 3 года'],
    slideImgStyle: {
      objectFit: 'cover',
    },
  };
  */

  let outputVideo = await render(props)
  console.log('got output video')

  if (!config.debugVideoRenderer) {
    await uploadBuffer(process.env.S3_TRANSATLANTIC_VIDEORENDER_BUCKET_NAME, item.uploadFilename, outputVideo.buffer);
  }
  else {
    await fs.writeFile(new URL('./testOutput.mp4', import.meta.url).pathname, outputVideo.buffer);
  }

  return {};
}

