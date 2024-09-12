import React from 'react';

export default function Area({ patchData, patchRef }) {
  const patchStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const areaStyle = {
    fontSize: '50px',
  };

  const textStyle = {
    fontSize: '29px',  
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div style={areaStyle}>{patchData}м<sup style={{fontSize: '0.6em'}}>2</sup></div>
      <div style={textStyle}>ПЛОЩАДЬ</div> 
      <div style={textStyle}>ОСВЕЩЕНИЯ</div>
    </div>
  );
}
