import React from 'react';
import { Img, staticFile } from 'remotion';


function FlagIcon({ country, style}) {
  const flagStyle = {
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #888',
    objectFit: 'cover',
    marginTop: '-3px',
  };

  return (
    <Img 
      src={staticFile(`/flags/${country.toLowerCase()}.svg`)} 
      width="57"
      height="37"
      style={flagStyle}
    />
  );
}

export default function({ patchData, patchRef, patchColor, shop }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      {!isRoomDecor && <FlagIcon country={patchData}/>}
      <div>{patchData}</div>
    </div>
  );
}
