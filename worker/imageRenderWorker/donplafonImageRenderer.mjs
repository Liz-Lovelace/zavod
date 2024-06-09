import sharp from 'sharp';
import fs from 'fs/promises';

let overlays = {};

let rawProperties = [JSON.parse('{"ID элемента":"66278","Наименование":"Бра Mantra Cuadrax 1113","Цена":"16886.00","Доступное количество":"6","Высота, мм":"150","Ширина, мм":"150","Длина, мм":"150","Вид ламп":"Светодиодная","Цоколь":"G9","Количество ламп":"2","Мощность лампы, W":"5","Общая мощность, W":"10","Напряжение":"220","Материал плафона/абажура":"Стекло","Цвет плафона/абажура":"Прозрачный","Материал арматуры":"Металл","Цвет арматуры":"Хром","Стиль":"Дизайнерский","Направление абажуров/плафонов":"Вверх","Место в интерьере":"В гостиную","Степень защиты (IP)":"20","Длина подвеса в мм":"1200","Коллекция":"Cuadrax Chrom Matte","Коробка вес кг":"1.67","Лампы в комплекте":"Да","Популярность":"999995393","Расположение":"На стену","Страна":"Испания","Форма плафона":"Квадратный","Штрих-код (служебное)":"8435153211133","Коробка вес гр":"1670","Коробка высота":"160","Коробка длина":"250","Коробка ширина":"100","Производитель":"Mantra","Гарантия":"60 месяцев","WB_BARCODE":"2150000112512","Идентификатор Озон":"23342589","Дата обновления фидом":"2024-06-05 18:21:06","Дата создания товара":"12.03.2016 01:20:06","МойСклад UUID":"4e4fa2d8-409a-11ea-0a80-05a70023ddd6","Кратность":"1","shopIds":[106397,106692,63614],"categoryStack":["Бра","Бра с 2 плафонами"]}')];

main();
async function main() {
  const sourceImagePath = new URL('./testSource.jpg', import.meta.url);
  const sourceImageBuffer = await fs.readFile(sourceImagePath);
  console.time();
  console.log(rawProperties[0]);
  await renderImage({
    sourceImageBuffer,
    props: rawProperties[0],
    backgroundColor: { r: 235, g: 235, b: 235 },
    width: 1000,
    height: 1000,
    padding: 100,
  });
  console.timeEnd();
}

async function renderImage({ sourceImageBuffer, props, backgroundColor, padding, width: outWidth, height: outHeight }) {
  const lumPath = new URL('./500LumTest.png', import.meta.url);
  const framePath = new URL('./frame.png', import.meta.url);
  const outputImagePath = new URL('./testOutput.jpeg', import.meta.url);

  // todo: this should be done once!!
  const lumImg = await fs.readFile(lumPath);
  let frameImg = await fs.readFile(framePath);
  frameImg = await sharp(frameImg).resize(outHeight * 0.99, outHeight * 0.99).toBuffer();

  const resizedImage = await sharp(sourceImageBuffer)
    .resize({
      width: outWidth - padding * 2,
      height: outHeight - padding * 2,
      fit: sharp.fit.contain,
      background: backgroundColor,
    });

  const extendedImage = await resizedImage
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: backgroundColor,
    });

  // Composite the overlay image onto the extended image
  await extendedImage
    .composite([{
      input: frameImg,
    }])
    .jpeg()
    .toFile(outputImagePath.pathname);
}