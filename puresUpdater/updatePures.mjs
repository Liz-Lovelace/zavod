import chalk from 'chalk';
import getVamsvetPures from './vamsvet/getVamsvetPures.mjs';
import getDonplafonPures from './donplafon/getDonplafonPures.mjs';
import getMelomanPures from './meloman/getMelomanPures.mjs';
import { dumpClientPureItems, dumpPureItems, getAllPureItemIds, getImages, getPureItems, savePureItems } from '../lib/database.mjs';
import config from '../config.mjs'

let pureItemGetters = {
  'donplafon': getDonplafonPures,
  'vamsvet': getVamsvetPures,
  'meloman': getMelomanPures,
};

await updateAllPures();
async function updateAllPures() {
  if (config.dumpDB) {
    await dumpPureItems();
  }
  await updateClientPures('vamsvet');
  await updateClientPures('meloman');
  await updateClientPures('donplafon');
}

export default async function updateClientPures(client) {
  console.log(chalk.green(`parsing ${client} feed...`));
  console.time('full pures update');

  let batch = [];

  const existingIds = new Set(await getAllPureItemIds());

  let i = 0;
  let totalNewItems = 0;
  for await (const pureItem of pureItemGetters[client]()) {
    if (++i % 10000 == 0) {
      console.log(i, `${client} items processed`);
    }

    if (existingIds.has(pureItem.id)) {
      continue;
    }

    batch.push(pureItem);
    existingIds.add(pureItem.id);

    if (batch.length === 1000) {
      await savePureItems(batch);
      totalNewItems += batch.length;
      batch = [];
    }
  }

  // Save any remaining items in the batch
  await savePureItems(batch);
  totalNewItems += batch.length;

  console.timeEnd('full pures update');
  console.log(chalk.green(`Saved ${totalNewItems} new ${client} pure items`));
}