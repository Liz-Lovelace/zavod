import chalk from 'chalk';
import getVamsvetPures from './vamsvet/getVamsvetPures.mjs';
import getDonplafonPures from './donplafon/getDonplafonPures.mjs';
import getMelomanPures from './meloman/getMelomanPures.mjs';
import { dumpClientPureItems, dumpPureItems, getAllPureItemIds, getImages, getPureItems, savePureItems } from '../lib/database.mjs';
import config from '../config.mjs';

let pureItemGetters = {
  'donplafon': getDonplafonPures,
};

await updateAllPures();
async function updateAllPures() {
  if (config.dumpDB) {
    console.log(chalk.red('dumping whole pureItems db...'));
    await dumpPureItems();
    console.log(chalk.red('PureItem db dumped'));
  }
  await updateClientPures('donplafon');
}

export default async function updateClientPures(client) {
  console.log(chalk.green(`parsing ${client} feed...`));
  console.time('full pures update');

  let batch = [];
  let totalNewItems = 0;
  let totalUpdatedItems = 0;
  let totalUnchangedItems = 0;

  let i = 0;
  for await (const pureItem of pureItemGetters[client]()) {
    i++

    batch.push(pureItem);

    if (batch.length === 1000) {
      const result = await savePureItems(batch);
      console.log(i, `${client} items processed`);
      totalNewItems += result.newItemsCount;
      totalUpdatedItems += result.updatedItemsCount;
      totalUnchangedItems += result.unchangedItemsCount;
      batch = [];
    }
  }

  // Save any remaining items in the batch
  if (batch.length > 0) {
    const result = await savePureItems(batch);
    totalNewItems += result.newItemsCount;
    totalUpdatedItems += result.updatedItemsCount;
    totalUnchangedItems += result.unchangedItemsCount;
  }

  console.timeEnd('full pures update');
  console.log(chalk.green(`Processed ${i} ${client} pure items`));
  console.log(chalk.green(`Created ${totalNewItems} new items`));
  console.log(chalk.green(`Updated ${totalUpdatedItems} items`));
  console.log(chalk.green(`Unchanged ${totalUnchangedItems} items`));
}
