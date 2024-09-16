import React from 'react';

export default function({ patchData, patchRef, position }) {
  let color = '#013eb1'
  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    textAlign: position.right ? 'right' : 'left',
  };

  const textStyle = {
    marginBottom: '10px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div>
        <div style={textStyle}>{patchData}</div>
        <div style={{fontSize: '35px'}}> ГАРАНТИЯ </div>
      </div>
    </div>
  );
}
