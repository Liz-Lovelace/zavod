import React from 'react';

export default function({ patchData, patchRef, position, patchColor }) {
  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    textAlign: position.right ? 'right' : 'left',
  };

  const textStyle = {
    marginBottom: '10px',
    color: patchColor,
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div>
        <div style={textStyle}>{patchData}</div>
        <div style={{fontSize: '35px', color: patchColor}}> ТИП КРЕПЛЕНИЯ </div>
      </div>
    </div>
  );
}