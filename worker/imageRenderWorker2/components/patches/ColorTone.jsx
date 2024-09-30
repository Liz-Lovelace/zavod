import React from 'react';
import SingleColorTone from './SingleColorTone';
import DoubleColorTone from './DoubleColorTone';
import RGBColorTone from './RGBColorTone';

const COLD_WHITE = '#B8E5FF';
const NEUTRAL_WHITE = '#F5F5F5';
const WARM_WHITE = '#ffc280';

function colorLookup(patchData) {
  const colorMap = {
    'НЕЙТРАЛЬНЫЙ БЕЛЫЙ': [['БЕЛЫЙ'], [NEUTRAL_WHITE]],
    'ТЕПЛЫЙ БЕЛЫЙ': [['ТЁПЛЫЙ'], [WARM_WHITE]],
    'ХОЛОДНЫЙ БЕЛЫЙ': [['ХОЛОДНЫЙ'], [COLD_WHITE]],
    'ОТ ТЕПЛОГО ДО ХОЛОДНОГО': [['ОТ ТЕПЛОГО', 'ДО ХОЛОДНОГО'], [WARM_WHITE, COLD_WHITE]],
    'ОТ ТЕПЛОГО ДО НЕЙТРАЛЬНОГО': [['ОТ ТЕПЛОГО', 'ДО НЕЙТРАЛЬНОГО'], [WARM_WHITE, NEUTRAL_WHITE]],
    'ОТ НЕЙТРАЛЬНОГО ДО ХОЛОДНОГО': [['ОТ НЕЙТРАЛЬНОГО', 'ДО ХОЛОДНОГО'], [NEUTRAL_WHITE, COLD_WHITE]],
    'RGB': [['RGB'], []],
  };
  return colorMap[patchData] || [[], []];
}

export default function ColorTone({ patchData, patchRef, patchColor, shop, position }) {
  const [toneTexts, toneColors] = colorLookup(patchData);
  
  if (patchData === 'RGB') {
    return (
      <RGBColorTone
        patchRef={patchRef}
        patchColor={patchColor}
        shop={shop}
        position={position}
      />
    );
  } else if (toneColors.length === 1) {
    return (
      <SingleColorTone
        patchData={toneTexts[0]}
        patchRef={patchRef}
        patchColor={patchColor}
        toneColor={toneColors[0]}
        shop={shop}
        position={position}
      />
    );
  } else if (toneColors.length === 2) {
    return (
      <DoubleColorTone
        tone1={toneTexts[0]}
        tone2={toneTexts[1]}
        patchRef={patchRef}
        patchColor={patchColor}
        toneColor1={toneColors[0]}
        toneColor2={toneColors[1]}
        shop={shop}
        position={position}
      />
    );
  } else {
    console.error('Invalid tone data:', patchData);
    return null;
  }
}
