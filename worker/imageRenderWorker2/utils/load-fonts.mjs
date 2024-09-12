import { continueRender, delayRender, staticFile } from 'remotion';
 
const waitForFont = delayRender();

const fonts = [
  new FontFace(
    'handel',
    `url('${staticFile('handel.ttf')}') format('truetype')`,
  ),
];
 
Promise.all(fonts.map(font => font.load()))
  .then(() => {
    fonts.forEach(font => document.fonts.add(font));
    continueRender(waitForFont);
  })
  .catch((err) => console.log('Error loading font', err));
