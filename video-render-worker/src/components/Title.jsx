import React from 'react';
import { Img, staticFile, AbsoluteFill, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { interpolateStyles } from '@remotion/animation-utils';

export function Title({ text }) {
  const { durationInFrames } = useVideoConfig();
  const progress = useCurrentFrame() / durationInFrames;

  let scaleStyle = interpolateStyles(
    progress,
    [0, 0.4],
    [{  transform: 'translateY(50px)' },
      {   transform: 'translateY(0)' }],
    {
      easing: Easing.bezier(0.95, 0.1, 0, 1),
      extrapolateRight: 'clamp',
    },
  );

  let opacityStyle = interpolateStyles(
    progress,
    [0, 0.25],
    [{ opacity: '-10%'     },
      {  opacity: '100%' }],
    {
      easing: Easing.bezier(0.8, 0.96, 0.22, 0.65),
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    },
  );

  return (
    <AbsoluteFill>
      <p style={{ ...opacityStyle, ...scaleStyle, ...staticTitleStyle }}>{text}</p>
    </AbsoluteFill>
  );
}

const staticTitleStyle = {
  width: '100%',
  color: 'white',
  textShadow: '0.07em 0.07em black, 0.03em 0.07em black, 0.07em 0.05em black',
  borderBottom: '10px solid #0001',
  backgroundColor: '#00000025',
  fontSize: '80px',
  padding: '110px 30px 10px',
  position: 'absolute',
  top: '-100px',
  margin: 0,
  textAlign: 'center',
  fontFamily: 'Euclid Triangle Medium',
};
