import React from 'react';
import { Img, Still, AbsoluteFill, useVideoConfig, Easing } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import zoomFade from '../transitions/zoomFade.jsx';
import { springTiming, linearTiming } from '@remotion/transitions';
import { PlafonImage } from './PlafonImage';
import { FlavorText } from './FlavorText';
import { EndingCard } from './EndingCard';
import { Title } from './Title';
import { Debug } from './Debug';

export function StillMain() {
  return (
    <>
      <Img src='https://partners.donplafon.ru/upload/iblock/bb1/12jwb29nkotxir9a9adxw82p64pgilee/potolochnaya_lyustra_evoluce_raito_sle1105_402_06.jpg' />
    </>
  );
}
