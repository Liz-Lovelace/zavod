import sharp from 'sharp';

export default async function imageAnalysisWorker({ url, index, pureItemId }) {
  const  imageBuffer = await fetch(url).then(res => res.arrayBuffer());
  console.log('analyzing image', url);
  return await analyzeImage(imageBuffer);
}

async function analyzeImage(buffer) {
  const image = sharp(buffer);
  const { width, height } = await image.metadata();
  
  let { allPixels, edgePixels } = await getSamplePixels(buffer, width, height, 9);

  let allPixelLumas = allPixels.map(toLuma);
  let edgePixelLumas = edgePixels.map(toLuma);

  let medianEdgeLuma = getMedianLuma(edgePixelLumas);
  let averageAllLuma = getAverageLuma(allPixelLumas);

  let uniqueAllColorsCount = getUniqueColorsCount(allPixels);
  let uniqueEdgeColorsCount = getUniqueColorsCount(edgePixels);

  return {
    medianEdgeBrightness: medianEdgeLuma,
    averageAllBrightness: Math.round(averageAllLuma),
    uniqueAllColorsCount,
    uniqueEdgeColorsCount,
    width,
    height,
  };
}

function getUniqueColorsCount(RGBs) {
  return new Set(RGBs.map(([ r, g, b ]) => `${r}${g}${b}`)).size;
}

function getMedianLuma(lumas) {
  lumas.sort((a, b) => a - b);
  return lumas[Math.floor(lumas.length / 2)];
}

function getAverageLuma(lumas) {
  return lumas.reduce((acc, val) => acc + val) / lumas.length;
}

function toLuma(RGB) {
  return RGB.reduce((acc, val) => acc + val) / RGB.length;
}

async function getSamplePixels(buffer, width, height, sampleCount) {
  let allPixels = [];
  let edgePixels = [];

  for (let i = 0; i < sampleCount; i++) {
    const x = Math.floor((width - 1) * i / (sampleCount - 1));
    const y = Math.floor((height - 1) * i / (sampleCount - 1));

    let verticalSlice = toRGBarray(sharp(buffer).extract({ left: x, top: 0, width: 1, height: height }));
    let horizontalSlice = toRGBarray(sharp(buffer).extract({ left: 0, top: y, width: width, height: 1 }));

    allPixels = allPixels.concat(verticalSlice, horizontalSlice);
    if (i == 0 || i == sampleCount - 1) {
      edgePixels = edgePixels.concat(verticalSlice, horizontalSlice);
    }
  }

  allPixels = await Promise.all(allPixels).then(slices => slices.flat());
  edgePixels = await Promise.all(edgePixels).then(slices => slices.flat());

  return { allPixels, edgePixels };
}

async function toRGBarray(sharpObj) {
  let { data, info } = await sharpObj.raw().toBuffer({ resolveWithObject: true });

  const pixels = [];
  for (let i = 0; i < data.length; i += info.channels) {
    pixels.push(data.subarray(i, i + 3));
  }
  return pixels;
}
