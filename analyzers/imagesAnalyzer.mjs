import { getFullItems } from '../lib/database.mjs';
import chalk from 'chalk';
/*
      medianEdgeBrightness: 88,
      uniqueEdgeColorsCount: 210,
      averageEdgeColor: "98|96|97",
      uniqueAllColorsCount: 4526,
      averageProductBrightness: 99.33333333333333,
      averageProductColor: "102|99|97",
      productBgPixelShare: 0,

*/

function analyzeImages(fullItems) {
  fullItems.forEach(item => {
    item.images.forEach(image => {
      if (!image) {
        console.log('undefined image?')
        return;
      }
      if (image.index !== 0) {
        return;
      }
      image.contrast = Math.abs(image.averageProductBrightness - image.medianEdgeBrightness)
      image.small = image.width < 500 && image.height < 500;
      image.instruction = image.uniqueAllColorsCount < 350;
      image.dark = image.medianEdgeBrightness <= 5 && image.contrast < 15;
      image.blinding = image.medianEdgeBrightness > 127 && image.contrast < 10;
      image.good = ![image.small, image.instruction, image.dark, image.blinding].some(Boolean);
    });
  });
  return fullItems;
}

main();
async function main() {
  let items = await getFullItems({ where: { client: 'donplafon' } });
  // await fs.writeFile('testItems.json', JSON.stringify(items));
  // let items = JSON.parse(await fs.readFile('testItems.json', 'utf-8'));
  items = analyzeImages(items);
  let total0 = 0;
  let total1 = 0;
  let total2 = 0;
  let total3 = 0;
  let error = 0;
  let instruction = 0;
  let small = 0;
  let dark = 0;
  let blinding = 0;
  let good = 0;
  items.forEach(item => {
    item.images.slice(0, 1).forEach(image => {
      if (!image) {
        return;
      }
      total0++;
      if (image.error) {
        error++;
        return;
      }
      total1++;
      if (image.small) {
        small++;
        return;
      }
      total2++;
      if (image.instruction) {
        instruction++;
        return;
      }
      total3++;
      if (image.dark || image.blinding) {
        if (image.dark) {
          console.log(image.contrast, image.averageProductBrightness, image.url)
          dark++;
        }
        if (image.blinding) {
          blinding++;
        }
        return;
      }
      if (image.good) {
        good++;
      }
    });
  });
  console.log(`${chalk.cyan(total1)} images total.\n\nOf those, ${percent(error, total0)} could not be downloaded\n\nOf the remaining, ${percent(small, total1)} are smaller than 500x500\n\nOf the remaining, ${percent(instruction, total2)} are instructions (<350 unique colors)\n\nOf the remaining:\n- ${percent(dark, total3)} are too dark (<180 average brightness)\n- ${percent(blinding, total3)} are too bright (>240 average brightness)\n\nAfter all that, ${chalk.cyan(good)} images remain, which is ${percent(good, total0)} of all images`);
}

function percent(n, total) {
  if (n / total < 0.03) {
    return chalk.cyan(Math.round(n / total * 1000) / 10 + '%');
  }
  else {
    return chalk.cyan(Math.round(n / total * 100) + '%');
  }
}
