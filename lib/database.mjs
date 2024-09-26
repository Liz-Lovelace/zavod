import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// pure items
export async function getPureItems(queryOptions = {}) {
  const pureItems = await prisma.pureItem.findMany(queryOptions);

  return pureItems.map(unpackagePureItem);
}

export async function getAllPureItemIds() {
  const pureItemIds = await prisma.pureItem.findMany({
    select: {
      id: true,
    },
  });

  return pureItemIds.map(item => item.id);
}

export async function pureItemExists(id) {
  const item = await prisma.pureItem.findUnique({
    where: { id },
  });
  return !!item;
}

export async function savePureItems(pureItems) {
  const ids = pureItems.map(item => item.id);
  const existingItems = await prisma.pureItem.findMany({
    where: {
      id: { in: ids },
    },
  });

  const existingItemsMap = new Map(existingItems.map(item => [item.id, item]));

  let newItemsCount = 0;
  let updatedItemsCount = 0;
  let unchangedItemsCount = 0;

  const newItems = [];
  const updatedItems = [];

  for (const pureItem of pureItems) {
    const existingItem = existingItemsMap.get(pureItem.id);
    if (existingItem) {
      if (existingItem.shops !== JSON.stringify(pureItem.shops)) {
        updatedItems.push(pureItem);
        updatedItemsCount++;
      } else {
        unchangedItemsCount++;
      }
    } else {
      newItems.push(pureItem);
      newItemsCount++;
    }
  }

  if (newItems.length > 0) {
    await prisma.pureItem.createMany({
      data: newItems.map(packagePureItem),
    });
  }

  for (const item of updatedItems) {
    await prisma.pureItem.update({
      where: { id: item.id },
      data: packagePureItem(item),
    });
  }

  return {
    newItemsCount,
    updatedItemsCount,
    unchangedItemsCount,
  };
}

export async function dumpClientPureItems(client) {
  await prisma.pureItem.deleteMany({
    where: { client },
  });
}

function packagePureItem(pureItem) {
  return {
    ...pureItem,
    remoteImages: pureItem.remoteImages.join('|'),
    shops: JSON.stringify(pureItem.shops),
    rawProperties: JSON.stringify(pureItem.rawProperties),
  };
}

export function unpackagePureItem(pureItem) {
  let images = pureItem.remoteImages;
  images = images !== ''
    ? images.split('|')
    : [];

  let shops = JSON.parse(pureItem.shops);

  return {
    ...pureItem,
    remoteImages: images,
    shops,
    rawProperties: JSON.parse(pureItem.rawProperties),
  };
}

export async function getFullItems(queryOptions = {}) {
  let itemsP = getPureItems(queryOptions);
  let imagesP = prisma.image.findMany();
  let [items, images] = await Promise.all([itemsP, imagesP]);
  let imageLookup = {};
  images.forEach(image => {
    imageLookup[image.url] = image;
  });
  items.forEach(item => {
    item.images = [];
    item.remoteImages.forEach(url => {
      let image = imageLookup[url];
      item.images.push(image);
    });
  });
  return items;
}

export async function dumpPureItems() {
  await prisma.pureItem.deleteMany({});
}

// images
export async function saveImageAnalysis(res) {
  await prisma.image.create({
    data: {
      url: res.taskData.keyURL,
      index: res.taskData.index,
      pureItemId: res.taskData.pureItemId,
      ...res.resultData,
    },
  });
}

export async function getImages(queryOptions = {}) {
  let images = await prisma.image.findMany(queryOptions);
  images.forEach(image => {
    if (image.error) {
      return;
    }
    image.averageEdgeColor = image.averageEdgeColor.split('|');
  });
  return images;
}

export async function getAllImageIds() {
  const pureItemIds = await prisma.image.findMany({
    select: {
      url: true,
    },
  });

  return new Set(pureItemIds.map(item => item.url));
}

export async function dumpImages() {
  await prisma.image.deleteMany({});
}
