import React from 'react';

export default function Area({ patchData, patchRef, position }) {
  const patchStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: position.right ? 'right' : 'left',
  };

  const areaStyle = {
    marginBottom: '10px',
  };

  const textStyle = {
    fontSize: '35px',  
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div style={areaStyle}>{patchData} м<sup style={{fontSize: '0.6em'}}>2</sup></div>
      <div style={textStyle}>ПЛОЩАДЬ</div> 
      <div style={textStyle}>ОСВЕЩЕНИЯ</div>
    </div>
  );
}
