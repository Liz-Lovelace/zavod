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
  // backgroundColor: '#0009',
  backgroundColor: '#008278',
  opacity: 0.8,
  color: 'white',
  fontSize: '60px',
  padding: '0.35em 0.6em 0.5em',
  position: 'absolute',
  textAlign: 'left',
  // fontFamily: 'Euclid Triangle',
  fontFamily: 'Futura Light',
  maxWidth: '80%',
  lineHeight: '0.9',
};

const topStyle = {
  top: 0,
  right: 0,
  // borderRadius: '15px 0 0 15px',
};

const bottomStyle = {
  bottom: 0,
  left: 0,
  // borderRadius: '0 15px 15px 0',
};
