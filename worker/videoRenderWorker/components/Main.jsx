import React from 'react';
import { AbsoluteFill, useVideoConfig, Easing } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import zoomFade from '../transitions/zoomFade.jsx';
import { springTiming, linearTiming } from '@remotion/transitions';
import { PlafonImage } from './PlafonImage';
import { FlavorText } from './FlavorText';
import { Title } from './Title';
import { Debug } from './Debug';

export function Main({ version, images, itemInfo, flavorTexts, title }) {
  const { durationInFrames } = useVideoConfig();
  const transitionDuration = 20;
  const totalImages = images.length;
  const imageDuration = durationInFrames / totalImages;

  return (
    <>
      <TransitionSeries>
        {images.map((image, index) => (
          <>
            <TransitionSeries.Sequence durationInFrames={imageDuration + transitionDuration}>
              <PlafonImage image={image} index={index}/>
              { index == 0 ?
                <Title text={title} /> :
                <FlavorText text={flavorTexts[index - 1]} index={index - 1}/>
              }
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              timing={springTiming({ durationInFrames: transitionDuration, config: { stiffness: 1 } })}
              presentation={fade()}
            />
          </>
        ))}
      </TransitionSeries>

    </>
  );
}
// <Debug version={version} itemInfo={itemInfo} text={''}/> 
