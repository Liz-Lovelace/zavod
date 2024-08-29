import React from 'react';
import { Img, staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolateStyles } from '@remotion/animation-utils';

export function PlafonImage({ imageURL, index }) {
  const { durationInFrames } = useVideoConfig();

  const alternator = index % 2 == 0 ? -1 : 1;

  const progress = useCurrentFrame() / durationInFrames;

  let scaleAdd = 0;
  const transformSet = [
    `translateX(0) translateY(0) scale(${1.1 + scaleAdd})`,
    `translateX(3%) translateY(-1%) scale(${1.06 + scaleAdd})`,
    `translateX(-3%) translateY(-1%) scale(${1.06 + scaleAdd})`,
    `translateX(1%) translateY(3%) scale(${1.06 + scaleAdd})`,
    `translateX(-2%) translateY(-2%) scale(${1.04 + scaleAdd})`,
    `translateX(3%) translateY(0) scale(${1.06 + scaleAdd})`,
  ];
  
  let transforms = [
    { transform: transformSet[index % transformSet.length] },
    { transform: `translateX(0) translateY(0) scale(${1 + scaleAdd})` },
  ];

  if (index % 2 == 1) {
    transforms.reverse();
  }

  let imgStyle = interpolateStyles(
    progress,
    [0, 1],
    transforms,
  );

  imgStyle = {
    ...imgStyle,
    width: '100%',
    height: '100%',
  };

  return (
    <AbsoluteFill>
      <div style={parentStyle} >
        <Img style={imgStyle} src={imageURL} />
      </div>
    </AbsoluteFill>
  );
}

const parentStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
