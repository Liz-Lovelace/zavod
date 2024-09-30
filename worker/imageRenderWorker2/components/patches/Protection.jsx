import React from 'react';

export default function Protection({ patchData, patchRef, position }) {
  const patchStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: position.right ? 'right' : 'left',
  };

  const protectionStyle = {
    marginBottom: '10px',
  };

  const textStyle = {
    fontSize: '35px',  
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div style={protectionStyle}>IP{patchData}</div>
      <div style={textStyle}>СТЕПЕНЬ</div> 
      <div style={textStyle}>ЗАЩИТЫ</div>
    </div>
  );
}
