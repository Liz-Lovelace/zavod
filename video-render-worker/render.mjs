import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import config from '../config.mjs';

export async function render(outputFilename, props) {
  // todo: the bundle thing really feels like something we should not be doing twice
  // const bundleLocation = await bundle({ entryPoint: './src/index.jsx' });
  console.time('bundle');
  const bundleLocation = await bundle({ entryPoint: './src/indexStill.jsx' });
  console.timeEnd('bundle');
  // return await initiateRender(props, outputFilename, bundleLocation);
  return await renderSingleFrame(props, outputFilename, bundleLocation);
}

async function initiateRender(inputProps, outputFilename, bundleLocation) {
  let composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'Main',
    inputProps,
  });

  return await renderMedia({
    composition,
    serveUrl: bundleLocation,
    // logLevel: 'verbose',
    // outputLocation: null,
    outputLocation: `out/${outputFilename}.mp4`,
    inputProps,
    concurrency: '100%',
    enableMultiProcessOnLinux: true,
    codec: 'h264',
    x264Preset: 'veryfast',
    crf: 25,
    jpegQuality: 100,
  });
}

// New function to render a single frame
async function renderSingleFrame(inputProps, outputFilename, bundleLocation) {
  console.time('select');
  let composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'Main',
    // inputProps,
  });
  console.timeEnd('select');

  console.time('render');
  let media = await renderStill({
    composition,
    serveUrl: bundleLocation,
    // logLevel: 'verbose',
    output: 'out/test.jpeg',
    // inputProps,
    jpegQuality: 100,
    imageFormat: 'jpeg',
  });
  console.timeEnd('render');
  return media;
}