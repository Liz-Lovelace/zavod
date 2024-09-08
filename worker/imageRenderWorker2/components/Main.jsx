import React, { useState, useRef, useEffect } from 'react';
import { Img } from 'remotion';
import PseudoPatch from './patches/PseudoPatch';

export function Main({ downloadURL }) {
  downloadURL = 'https://partners.donplafon.ru/upload/iblock/bb1/12jwb29nkotxir9a9adxw82p64pgilee/potolochnaya_lyustra_evoluce_raito_sle1105_402_06.jpg'

  let texts = ['33333', '11', '2222'];

  return (
    <>
      <Img src={downloadURL} />
      <PseudoPatch t="TITLE" style={{ top: '60px', left: '40px' }} />
      <PseudoPatch t={texts[0]} style={{ bottom:'200px', left: '40px' }} />
      <PseudoPatch t={texts[1]} style={{ top:'220px', right: '40px' }} />
      <PseudoPatch t={texts[2]} style={{ bottom:'40px', right: '40px' }} />
    </>
  );
}
