import { continueRender, delayRender, staticFile } from 'remotion';
 
const waitForFont = delayRender();

const fonts = [
  new FontFace(
    'handel',
    `url('${staticFile('handel.ttf')}') format('truetype')`,
  ),
  new FontFace(
    'pppangram',
    `url('${staticFile('pppangram.otf')}') format('opentype')`,
  ),
  new FontFace(
    'montserrat',
    `url('${staticFile('montserrat-bold.ttf')}') format('truetype')`,
  ),
  new FontFace(
    'futura',
    `url('${staticFile('futura-demi.ttf')}') format('truetype')`,
  ),
];
 
Promise.all(fonts.map(font => font.load()))
  .then(() => {
    fonts.forEach(font => document.fonts.add(font));
    continueRender(waitForFont);
  })
  .catch((err) => console.log('Error loading font', err));
