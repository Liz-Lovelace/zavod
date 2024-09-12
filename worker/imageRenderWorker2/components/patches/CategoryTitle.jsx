import React from 'react';

export default function({ patchData, style }) {
  const patchStyle = {
    fontSize: '60px',
    fontWeight: 400,
    maxWidth: '700px',
    minWidth: '400px',
    lineHeight: 1,
    width: 'min-content',
  };

  return <div style={patchStyle}>{patchData}</div>;
};

