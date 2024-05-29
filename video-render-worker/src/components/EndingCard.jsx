import React from 'react';
import { Img, staticFile, AbsoluteFill } from 'remotion';

export function EndingCard() {
  return (
    <AbsoluteFill style={endingCardStyle}>
      <Img style={logoStyle} src={staticFile('/don-plafon.png')} />
    </AbsoluteFill>
  );
}

const endingCardStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
};

const logoStyle = {
  width: '70%',
};
