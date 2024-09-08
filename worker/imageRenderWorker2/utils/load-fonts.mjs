import { continueRender, delayRender, staticFile } from 'remotion';
 
const waitForFont = delayRender();

const fonts = [
  new FontFace(
    'Euclid Triangle',
    `url('${staticFile('euclid-triangle-regular.woff')}') format('woff')`,
  ),
  new FontFace(
    'Euclid Triangle Medium',
    `url('${staticFile('euclid-triangle-medium.woff')}') format('woff')`,
  ),
  new FontFace(
    'Debug',
    `url('${staticFile('mono-regular.ttf')}') format('truetype')`,
  ),
];
 
Promise.all(fonts.map(font => font.load()))
  .then(() => {
    fonts.forEach(font => document.fonts.add(font));
    continueRender(waitForFont);
  })
  .catch((err) => console.log('Error loading font', err));
