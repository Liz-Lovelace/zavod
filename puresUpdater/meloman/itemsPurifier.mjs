export default function purifyItem(rawItem) {
  const client = 'meloman';
  let offerId = rawItem['g:id'];

  let imageURLs = getImages(rawItem);

  let pureItem = {
    id: `${client}-${offerId}`,
    client,
    offerId,
    remoteImages: imageURLs,
    rawProperties: {
      ...rawItem,
      'g:id': undefined,
      'g:image_link': undefined,
      categoryStack: [rawItem.category],
      category: undefined,
      img1: undefined,
      img2: undefined,
      img3: undefined,
      img4: undefined,
      img5: undefined,
      img6: undefined,
      img7: undefined,
      img8: undefined,
      img9: undefined,
      img10: undefined,
      img11: undefined,
      img12: undefined,
      img13: undefined,
    },
  };

  return pureItem;
}

function getImages(rawItem) {
  let i = 1;
  let images = [];
  if (rawItem['g:image_link']) {
    images.push(rawItem['g:image_link']);
  }
  while (rawItem[`img${i}`]) {
    images.push(rawItem[`img${i}`]);
    i++;
  }
  return images;
}
