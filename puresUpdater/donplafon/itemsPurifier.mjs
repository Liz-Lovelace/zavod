export default function purifyItem(rawItem) {
  const client = 'donplafon';
  let offerId = rawItem.offerId;

  let imageURLs = getImages(rawItem);

  let pureItem = {
    id: `${client}-${offerId}`,
    client,
    offerId,
    remoteImages: imageURLs,
    applicableDesigns: rawItem.shopIds,
    rawProperties: {
      ...extractAllProperties(rawItem),
      categoryStack: [rawItem['Раздел 1'], rawItem['Раздел 2']],
    },
  };

  return pureItem;
}

function extractAllProperties(rawItem) {
  let badProperties = new Set(['Основное фото', 'Дополнительные фото', 'Раздел 1', 'Раздел 2', 'Артикул', 'offerId']);

  let properties = {};
  for (let [key, value] of Object.entries(rawItem)) {
    if (value && !badProperties.has(key)) {
      properties[key] = value;
    }
  }

  return properties;
}

function getImages(item) {
  let images = [item['Основное фото']];
  if (item['Дополнительные фото']) {
    images = images.concat(item['Дополнительные фото'].split(', '));
  }
  return images;
}
