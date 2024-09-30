import React from 'react';

function ColorToneIconSVG({ color, toneColor }) {
return (
    <svg width="48" height="90" viewBox="0 0 48 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="46" height="88" rx="13" fill={toneColor} stroke={color} stroke-width="2"/>
    </svg>

  );
}

export default function SingleColorTone({ patchData, patchRef, patchColor, toneColor, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: position?.right ? 'flex-end' : 'flex-start'
  };

  const textStyle = {
    marginLeft: '15px',
    textAlign: isRoomDecor ? position?.right ? 'right' : 'left' : 'left',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      {!isRoomDecor && <ColorToneIconSVG color={patchColor} toneColor={toneColor} />}
      <div style={textStyle}>
        <div>{patchData}</div>
        <div>СВЕТ</div>
      </div>
    </div>
  );
}