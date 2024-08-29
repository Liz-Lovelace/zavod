import React from 'react';
import { AbsoluteFill } from 'remotion';

export function FlavorText({ text, index }) {
  if (!text) {
    return;
  }

  let positionStyle = [bottomStyle, topStyle][index % 2];

  return (
    <AbsoluteFill>
      <p style={{ ...plafonInfoStyle, ...positionStyle }}>{text}</p>
    </AbsoluteFill>
  );
}

const plafonInfoStyle = {
  backgroundColor: '#0009',
  color: 'white',
  fontSize: '60px',
  padding: '0.1em 0.6em',
  position: 'absolute',
  textAlign: 'left',
  fontFamily: 'Euclid Triangle',
  maxWidth: '80%',
};

const topStyle = {
  top: 0,
  right: 0,
  borderRadius: '15px 0 0 15px',
};

const bottomStyle = {
  bottom: 0,
  left: 0,
  borderRadius: '0 15px 15px 0',
};
