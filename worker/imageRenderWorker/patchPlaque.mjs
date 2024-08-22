import sharp from 'sharp';

export async function getPlaque({ width, height, flip }) {
  width += Math.round(height / 2);
  let plaque = sharp(Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="${height / 2}" fill="white" fill-opacity="0.5" stroke="#023897" stroke-width="2"/>
  </svg>`))
    .extract({
      left: Math.round(height / 2),
      width: width - Math.round(height / 2),
      top: 0,
      height,
    });

  if (flip) {
    plaque.flop();
  }

  return plaque;
}

