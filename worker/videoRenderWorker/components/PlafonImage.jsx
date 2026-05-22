import React from 'react';
import { Img, staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolateStyles } from '@remotion/animation-utils';

export function PlafonImage({ image, index, slideImgStyle }) {
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
    objectFit: 'contain',
    ...slideImgStyle,
  }

  let averageEdgeColor = image.averageEdgeColor.split('|')
  let backgroundColor = (image.medianEdgeBrightness == 255 || image.medianEdgeBrightness == 0) ?
    `rgb(${image.medianEdgeBrightness}, ${image.medianEdgeBrightness}, ${image.medianEdgeBrightness})`
    : `rgb(${averageEdgeColor[0]}, ${averageEdgeColor[1]}, ${averageEdgeColor[2]})`

  let parentStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <AbsoluteFill>
      <div style={parentStyle} >
        <Img style={imgStyle} src={image.downloadURL} />
      </div>
    </AbsoluteFill>
  );
}

