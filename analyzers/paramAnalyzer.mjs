import { getAllPureItemIds, getPureItems, savePureItems } from './database.mjs';
import chalk from 'chalk';
import textTable from 'text-table';

let topCategoriesTypes = {
  vamsvet: {
    good: new Set([ 'Светильники', 'Бра и подсветки', 'Уличное освещение', 'Настольные лампы', 'Светодиодная подсветка', 'Споты', 'Офисное освещение', 'Люстры', 'Лампочки', 'Торшеры']),
    bad: new Set([ 'Уличная мебель', 'Хранение', 'Электрокамины', 'Электротовары', 'Трековые системы', 'Комплектующие', 'Предметы интерьера', 'Новогодние товары', 'Столы', 'Кресла', 'Стулья', 'Ковры', 'Комната']),
  },
};

const badProperties = {
  vamsvet: new Set(['Новинка', 'Акция', 'Высота, мм', 'Диаметр, мм', 'Глубина, мм', 'Ширина, мм', 'Длина, мм', 'Диаметр врезного отверстия, мм', 'Кол-во рожков', 'Высота встраиваемой части, мм', 'Форма рассеивателя', 'Форма рамки/механизма', 'Количество постов', 'Теги', 'Остаток поставщика']),
  donplafon: new Set(['Причины скрытия FBO (при наличии)', 'Причины скрытия FBS (при наличии)', 'Цена Premium, ₽', 'Рыночная цена, ₽', 'Актуальная ссылка на рыночную цену', 'Вес в кг', 'Высота мм', 'Распродажа', 'Регулировка по высоте', 'Снят с производства', 'Тип выключателя', 'Новинка', 'Оценка', 'Отзывы', 'Рейтинг', 'Материал корпуса', 'Цвет корпуса', 'Размер монтажного отверстия', 'Статус товара', 'Видимость FBO', 'Видимость FBS', 'Категория комиссии', 'Доступно к продаже по схеме FBO, шт.', 'Вывезти и нанести КИЗ (кроме Твери), шт', 'Зарезервировано, шт', 'Доступно к продаже по схеме realFBS, шт.', 'Размер НДС, %', 'ТНВЭД', '﻿"Артикул"', 'Ozon Product ID', 'FBO OZON SKU ID', 'FBS OZON SKU ID', 'Barcode', 'Дата создания', 'Объем товара, л', 'Объемный вес, кг', 'Доступно к продаже по схеме FBS, шт.', 'Зарезервировано на моих складах, шт', 'ID элемента', 'Наименование', 'Цена', 'Доступное количество', 'Выгода', 'Коробка вес кг', 'Популярность', 'Штрих-код (служебное)', 'Коробка вес гр', 'Коробка высота', 'Коробка длина', 'Коробка ширина', 'WB_BARCODE', 'Идентификатор в Леруа', 'Идентификатор Озон', 'Я.Маркет SKU', 'Дата обновления фидом', 'Дата создания товара', 'МойСклад UUID', 'Кратность']),
  meloman: new Set(),
};


await main();
async function main() {
  let items = await getPureItems({
    where: {
      client: 'meloman',
      // id: 'meloman-1016307'
    },
  });
  let properties = new Set(items.map(i => i.rawProperties.categoryStack[0]));
  properties.forEach(prop => console.log(prop));
  // (new Array(properties)).forEach(console.log)
  // console.log(items)
  // showImageStatistics(items);
  /*
  showCategoryTypesCount(items);
  console.log(chalk.green('\n---------------------------------\n'));
  items = items.filter(isItemCategoryGood);
  showBadProperties(items, 'vamsvet');
  */
}

function showImageStatistics(pureItems) {
  let imageCounts = {};
  let totalImageCount = 0;
  pureItems.forEach(pureItem => {
    let imageCount = pureItem.remoteImages.length;
    totalImageCount += imageCount;
    imageCounts[imageCount] = (imageCounts[imageCount] || 0) + 1;
  });

  let maxCases = Math.max(...Object.values(imageCounts));

  let tableData = [['Images', 'Cases', '']];
  for (let [imageCount, cases] of Object.entries(imageCounts)) {
    tableData.push([
      imageCount,
      cases,
      '#'.repeat(Math.round(cases / maxCases * 80)),
    ]);
  }

  let tableConfig = {
    align: ['l', 'r', 'l'],
    // hsep: ' | '
  };

  console.log(textTable(tableData, tableConfig));
  console.log('Total items:', pureItems.length);
  console.log('Total images:', totalImageCount);
}

function showBadProperties(items, client) {
  const totalItems = items.length;
  const propertyStats = {};
  const propertyExamples = {};

  for (const { rawProperties } of items) {
    for (const key in rawProperties) {
      if (!rawProperties[key]) {
        continue;
      }

      propertyStats[key] = (propertyStats[key] || 0) + 1;

      if (!propertyExamples[key]) {
        propertyExamples[key] = new Set();
      }
      if (propertyExamples[key].size < 10) {
        propertyExamples[key].add(rawProperties[key]);
      }

    }
  }

  for (const property in propertyExamples) {
    propertyExamples[property] = Array.from(propertyExamples[property]);
  }

  let skipProperties = badProperties[client];

  for (const property in propertyStats) {
    propertyStats[property] = (propertyStats[property] / totalItems) * 100;
    if (!skipProperties.has(property)) {
      console.log(`**${property}** ${Math.round(propertyStats[property])}% \n${propertyExamples[property].join(', ')}\n`);
      // console.log(`"${property}",`)
    }
  }
}

export function isItemCategoryGood(item) {
  return topCategoryType(item.client, item.rawProperties.categoryStack[0]) == 'good';
}

function showTopLvlCategories(items) {
  let topCategories = new Set();
  for (let item of items) {
    let topCategory = item.rawProperties.categoryStack[0];
    if (!topCategories.has(topCategory)) {
      topCategories.add(topCategory);
      console.log(topCategory);
    }
  }
}

function showCategoryTypesCount(items) {
  let typeCounts = {};
  for (let item of items) {
    let type = topCategoryType(item.client, item.rawProperties.categoryStack[0]);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  console.log('good category items:', typeCounts['good']);
  console.log('other category items:', items.length - typeCounts['good']);
  console.log(`${100 - Math.round(typeCounts['good'] / items.length * 100)}% other category items`);
}

function topCategoryType(client, topCategory) {
  if (!topCategoriesTypes[client]) {
    throw 'client not found in category lookup';
  }

  let types = Object.keys(topCategoriesTypes[client]);
  for (let type of types) {
    if (topCategoriesTypes[client][type].has(topCategory)) {
      return type;
    }
  }

  throw new Error(`Unknown top-level category: ${topCategory} for client: ${client}`);
}
