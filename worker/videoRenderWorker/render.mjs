import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';

export async function render(inputProps) {
  console.time('bundle');
  // todo: the bundle thing really feels like something we should not be doing twice. The docs explicitly say that it should be cached.
  const bundleLocation = await bundle({ entryPoint: './worker/videoRenderWorker/index.jsx' });
  console.timeEnd('bundle');

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
    inputProps,
    concurrency: '100%',
    enableMultiProcessOnLinux: true,
    codec: 'h264',
    x264Preset: 'veryfast',
    crf: 25,
    jpegQuality: 100,
  });
}
