import React from 'react';

export default function({ patchData, patchRef }) {
  const patchStyle = {
    // backgroundColor: '#0009',
  };

  return <div ref={patchRef} style={patchStyle}>{patchData}</div>;
};
