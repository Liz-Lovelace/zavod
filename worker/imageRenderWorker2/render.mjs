import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import config from '../../config.mjs';

export async function render(inputProps) {
  // todo: the bundle thing really feels like something we should not be doing twice
  console.time('bundle');
  const bundleLocation = await bundle({ entryPoint: './worker/imageRenderWorker2/index.jsx' });
  console.timeEnd('bundle');

  let composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'Main',
    inputProps,
  });

  console.time('render');
  let media = await renderStill({
    composition,
    serveUrl: bundleLocation,
    logLevel: 'verbose',
    inputProps,
    jpegQuality: 100,
    imageFormat: 'jpeg',
  });
  console.timeEnd('render');

  return media;
}
