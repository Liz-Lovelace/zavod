import React from 'react';

export default function({ patchData, patchRef, position }) {
  let color = '#013eb1'
  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    textAlign: position.right ? 'right' : 'left',
  };

  const textStyle = {
    marginBottom: '-8px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div style={textStyle}>
        <div>{patchData}</div>
        <div style={{fontSize: '29px'}}> ГАРАНТИЯ </div>
      </div>
    </div>
  );
}
