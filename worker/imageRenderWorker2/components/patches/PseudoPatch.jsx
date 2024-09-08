import React from 'react';

export default function({ t, style }) {
  const patchStyle = {
    position: 'absolute',
    backgroundColor: '#0009',
    fontSize: '72px',
    margin: 0,
    ...style,
  };

  return <p style={patchStyle} >{t} </p>;
};
