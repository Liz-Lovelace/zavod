import sharp from 'sharp';
import { sleep } from '../lib/utils.mjs';

export default async function imageAnalysisWorker({ downloadURL }) {
  const imageBuffer = await fetch(downloadURL).then(res => res.arrayBuffer());
  console.log('analyzing image', downloadURL);
  return await analyzeImage(imageBuffer);
}

async function analyzeImage(buffer) {
  const image = sharp(buffer);
  const { width: fullWidth, height: fullHeight } = await image.metadata();

  const compressedSize = getCompressedSize(image);

  let edgePixels = await getSampleEdgePixels(buffer, fullWidth, fullHeight);
  let uniqueEdgeColorsCount = getUniqueColorsCount(edgePixels);
  let averageEdgeRGB = getAverageColor(edgePixels);
  let edgePixelLumas = edgePixels.map(toLuma);
  let medianEdgeLuma = getMedianLuma(edgePixelLumas);

  let [ boundImage, boundingBox ] = await getBoundImage(image, fullWidth, fullHeight);
  let samplePixels = await toRGBarray(await resizeToTargetPixelCount(boundImage, 25000, boundingBox.boundWidth, boundingBox.boundHeight));
  // await drawBoundingBox(image, boundingBox);

  let uniqueAllColorsCount = getUniqueColorsCount(samplePixels);
  let averageProductRGB = getAverageColor(samplePixels, averageEdgeRGB);
  let averageProductLuma = toLuma(averageProductRGB);

  let productBgPixelCount = countRGBs(samplePixels, [medianEdgeLuma, medianEdgeLuma,  medianEdgeLuma]);
  let productBgPixelShare = Math.round(productBgPixelCount / samplePixels.length * 100);

  return {
    medianEdgeBrightness: medianEdgeLuma,
    averageEdgeColor: averageEdgeRGB.join('|'),
    uniqueEdgeColorsCount,
    uniqueAllColorsCount,
    averageProductColor: averageProductRGB.join('|'),
    averageProductBrightness: averageProductLuma,
    productBgPixelShare,
    width: fullWidth,
    height: fullHeight,
    compressedSize: await compressedSize,
    boundingBoxTop: boundingBox.top,
    boundingBoxBottom: boundingBox.bottom,
    boundingBoxLeft: boundingBox.left,
    boundingBoxRight: boundingBox.right,
  };
}

async function resizeToTargetPixelCount(image, targetPixelCount, originalWidth, originalHeight) {
  let aspectRatio = originalHeight / originalWidth;
  let scale = Math.sqrt(targetPixelCount / aspectRatio) / originalWidth;
  return sharp(await image.toBuffer()).resize({
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  });
}

function getUniqueColorsCount(RGBs) {
  return new Set(RGBs.map(([ r, g, b ]) => `${r}${g}${b}`)).size;
}

function getMedianLuma(lumas) {
  lumas.sort((a, b) => a - b);
  return lumas[Math.floor(lumas.length / 2)];
}

function toLuma(RGB) {
  return RGB.reduce((acc, val) => acc + val) / RGB.length;
}

async function getSampleEdgePixels(buffer, width, height) {
  let edgePixels = [];

  edgePixels.push(toRGBarray(sharp(buffer).extract({ left: 0, top: 0, width: width, height: 1 })));
  edgePixels.push(toRGBarray(sharp(buffer).extract({ left: 0, top: height - 1, width: width, height: 1 })));
  edgePixels.push(toRGBarray(sharp(buffer).extract({ left: 0, top: 0, width: 1, height: height })));
  edgePixels.push(toRGBarray(sharp(buffer).extract({ left: width - 1, top: 0, width: 1, height: height })));

  return await Promise.all(edgePixels).then(slices => slices.flat());
}

async function getBoundImage(fullImage, fullWidth, fullHeight) {
  let boundImage = sharp(await fullImage.toBuffer()).trim();
  let buffer = await boundImage.toBuffer({ resolveWithObject: true });
  let {
    trimOffsetLeft,
    trimOffsetTop,
    width: boundWidth,
    height: boundHeight,
  } = buffer.info;
  return [ boundImage, {
    fullWidth,
    fullHeight,
    boundWidth,
    boundHeight,
    top: -trimOffsetTop,
    left: -trimOffsetLeft,
    right: boundWidth - trimOffsetLeft,
    bottom: boundHeight - trimOffsetTop,
  } ];
}

async function getCompressedSize(image) {
  const compressedBuffer = await sharp(await image.toBuffer())
    .resize(1000, 1000, { fit: 'inside' })
    .jpeg()
    .toBuffer();

  return compressedBuffer.length;
}

async function drawBoundingBox(fullImage, boundingBox) {
  const { fullWidth, fullHeight, top, left, right, bottom } = boundingBox;

  const outputImage = sharp(await fullImage.toBuffer())
    .composite([
      {
        input: Buffer.from(`
          <svg width="${fullWidth}" height="${fullHeight}">
            <rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" stroke="red" stroke-width="10" fill="none" />
          </svg>
        `),
        top: 0,
        left: 0,
      },
    ])
    .jpeg();

  await outputImage.toFile('boundingImage.jpeg');
}

async function toRGBarray(sharpObj) {
  let { data, info } = await sharpObj.raw().toBuffer({ resolveWithObject: true });

  const pixels = [];
  for (let i = 0; i < data.length; i += info.channels) {
    pixels.push(data.subarray(i, i + 3));
  }
  return pixels;
}

function getAverageColor(RGBs, excludeRGB = null) {
  const filteredRGBs = excludeRGB ? RGBs.filter(rgb => !colorEquals(rgb, excludeRGB)) : RGBs;

  const sumRGB = filteredRGBs.reduce(
    (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
    [0, 0, 0],
  );
  return sumRGB.map((sum) => Math.round(sum / filteredRGBs.length));
}

function colorEquals(a, b) {
  return a.every((val, index) => val === b[index]);
}

function countRGBs(RGBs, targetRGB) {
  return RGBs.filter(rgb => colorEquals(rgb, targetRGB)).length;
}
