import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export function Debug({ version, text, itemInfo }) {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <p style={versionStyle}>Version {version}</p>
      <p style={currentFrameStyle}> {useCurrentFrame()} / {durationInFrames} ( {durationInFrames / fps}s )</p>
      <p style={itemInfoStyle}> {itemInfo} </p>
      {text && <p style={extraTextStyle}> {text} </p>}
    </AbsoluteFill>
  );
}

const textStyle = {
  fontSize: '16px',
  color: '#0009',
  margin: 0,
  position: 'absolute',
  fontFamily: 'Debug',
};

const extraTextStyle = {
  ...textStyle,
  fontSize: '80px',
  color: 'black',
  top: '50px',
  bottom: 'auto',
  left: '100px',
  backgroundColor: 'white',
  padding: '3px 6px',
};

const versionStyle = {
  ...textStyle,
  left: '5px',
  bottom: '2px',
};

const currentFrameStyle = {
  ...textStyle,
  right: '5px',
  bottom: '2px',
};

const itemInfoStyle = {
  ...textStyle,
  right: '5px',
  top: '2px',
};
