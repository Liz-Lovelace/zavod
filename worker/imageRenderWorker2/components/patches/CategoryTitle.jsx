import React from 'react';

export default function({ patchData, style }) {
  const patchStyle = {
    fontSize: '60px',
    fontWeight: 400,
    maxWidth: '700px',
    lineHeight: 1,
    width: 'min-content',
  };

  if (patchData.split(' ').length !== 1) {
    patchStyle.minWidth = '400px' 
  }

  return <div style={patchStyle}>{patchData}</div>;
};

