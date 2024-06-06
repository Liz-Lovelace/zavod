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
  await prisma.pureItem.createMany({
    data: pureItems.map(packagePureItem),
  });
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
    rawProperties: JSON.stringify(pureItem.rawProperties),
  };
}

function unpackagePureItem(pureItem) {
  let images = pureItem.remoteImages;
  images = images !== ''
    ? images.split('|')
    : [];

  return {
    ...pureItem,
    remoteImages: images,
    rawProperties: JSON.parse(pureItem.rawProperties),
  };
}

export async function getFullItems(queryOptions = {}) {
  let itemsP = getPureItems(queryOptions);
  let imagesP = prisma.image.findMany();
  let [items, images] = await Promise.all([itemsP, imagesP])
  let imageLookup = {}
  images.forEach(image => {
    imageLookup[image.url] = image;
  })
  items.forEach(item => {
    item.images = [];
    item.remoteImages.forEach(url => {
      let image = imageLookup[url]
      item.images.push(image);
    })
  })
  return items;
}

// images
export async function saveImageAnalysis(res) {
  await prisma.image.create({
    data: {
      url: res.taskData.keyURL,
      index: res.taskData.index,
      ...res.resultData,
    },
  });
}

export async function getImages(queryOptions = {}) {
  return await prisma.image.findMany(queryOptions);
}

export async function getAllImageIds() {
  const pureItemIds = await prisma.image.findMany({
    select: {
      url: true,
    },
  });

  return new Set(pureItemIds.map(item => item.url));
}