import sharp from 'sharp';
import fs from 'fs/promises';

let overlays = {};

main();
async function main() {
  const sourceImagePath = new URL('./testSource.jpg', import.meta.url);
  const sourceImageBuffer = await fs.readFile(sourceImagePath);
  console.time()
  await renderImage({
    sourceImageBuffer,
    backgroundColor: {r: 235, g: 235, b: 235},
    width: 1000,
    height: 1000,
    padding: 100,
  });
  console.timeEnd();
}

async function renderImage({sourceImageBuffer, backgroundColor, padding, width: outWidth, height: outHeight}){
  const lumPath = new URL('./500LumTest.png', import.meta.url);
  const framePath = new URL('./frame.png', import.meta.url);
  const outputImagePath = new URL('./testOutput.jpeg', import.meta.url);

  // todo: this should be done once!!
  const lumImg = await fs.readFile(lumPath);
  let frameImg = await fs.readFile(framePath);
  frameImg = await sharp(frameImg).resize(outHeight*0.99, outHeight*0.99).toBuffer();

  const resizedImage = await sharp(sourceImageBuffer)
    .resize({
      width: outWidth - padding * 2,
      height: outHeight - padding * 2,
      fit: sharp.fit.contain,
      background: backgroundColor,
    })

  const extendedImage = await resizedImage
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: backgroundColor,
    })

  // Composite the overlay image onto the extended image
  await extendedImage
    .composite([{
      input: lumImg,
      gravity: 'southeast',
    }, {
      input: frameImg,
    }])
    .jpeg()
    .toFile(outputImagePath.pathname);
};