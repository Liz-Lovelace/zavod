import React from 'react';

export default function Diameter({ patchData, patchRef, position }) {
  const patchStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: position.right ? 'right' : 'left',
  };

  const diameterStyle = {
    marginBottom: '10px',
  };

  const textStyle = {
    fontSize: '35px',  
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div style={diameterStyle}>{patchData} мм</div>
      <div style={textStyle}>ДИАМЕТР</div> 
      <div style={textStyle}>ОТВЕРСТИЯ</div>
    </div>
  );
}