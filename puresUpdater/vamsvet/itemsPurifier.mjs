export default function purifyItem(rawItem, categoryLookup) {
  const client = 'vamsvet';
  let offerId = rawItem['$'].id;

  let pureItem = {
    id: `${client}-${offerId}`,
    client,
    offerId,
    remoteImages: rawItem.picture,
    rawProperties: {
      ...extractAllProperties(rawItem),
      categoryStack: categoryLookup[rawItem.categoryId[0]],
    },
  };

  return pureItem;
}

function extractAllProperties(rawItem) {
  let properties = {};
  for (let param of rawItem.param) {
    properties[param['$'].name] = param['_'];
  }

  let extraProperties = {
    available: rawItem['$'].available,
    price: rawItem.price[0],
    name: rawItem.name[0],
    url: rawItem.url[0],
  };

  return { ...properties, ...extraProperties };
}