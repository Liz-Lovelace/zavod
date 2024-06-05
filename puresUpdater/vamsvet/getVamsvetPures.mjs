import { download } from '../../lib/utils.mjs';
import chalk from 'chalk';
import purifyItem from './itemsPurifier.mjs';
import xml2js from 'xml2js';
import FS from 'fs';

const fs = {
  ...FS.promises,
  existsSync: FS.existsSync,
};

const feedPath = new URL('file:./materials/vamsvetFeed.xml', import.meta.url);

export default async function* getPureItems() {
  if (!fs.existsSync(feedPath)) {
    await download('https://www.vamsvet.ru/export/search_new.xml', feedPath);
  }

  let { offers, categories } = await getOffersAndCategoriesXMLs(feedPath);
  console.log(offers.length, 'vamsvet items total');

  let categoryLookup = await composeCategoryLookup(categories);
  const parser = new xml2js.Parser();
  
  for (const offerXML of offers) {
    const rawItem = await parser.parseStringPromise(offerXML);
    yield purifyItem(rawItem.offer, categoryLookup);
  }
}

async function getOffersAndCategoriesXMLs(feedPath) {
  const xmlString = await fs.readFile(feedPath, 'utf-8');
  let offers = xmlString.match(/<offer .*?<\/offer>/gs);
  let categories = xmlString.match(/<category .*?<\/category>/gs);
  return { offers, categories };
}
  
async function composeCategoryLookup(categoryXMLs) {
  let parsedCategories = {};
  const parser = new xml2js.Parser();
  for (let rawCategory of categoryXMLs) {
    const { category } = await parser.parseStringPromise(rawCategory);
    // we're doing $ instead of @
    parsedCategories[category['$'].id] = {
      name: category['_'],
      parentId: category['$'].parentId,
    };
  }

  let categoryLookup = {};
  for (let id of Object.keys(parsedCategories)) {
    let category = parsedCategories[id];
    categoryLookup[id] = recursiveCategoryStack(parsedCategories, category);
  }

  return categoryLookup;
}

function recursiveCategoryStack(allCategories, category) {
  let stack = [];
  if (category.parentId) {
    stack = stack.concat(recursiveCategoryStack(allCategories, allCategories[category.parentId]));
  }
  stack.push(category.name);
  return stack;
}