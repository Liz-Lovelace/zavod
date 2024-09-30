import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M44.667 3.5V17.5583M44.667 72.4417V86.5M15.3152 15.6482L26.0571 26.3901M63.2769 63.6099L74.0188 74.3518M3.16699 45H17.2253M71.1087 45H86.167M15.3152 74.3518L26.0571 63.6099M63.2769 26.3901L74.0188 15.6482" stroke={color} stroke-width="6" stroke-linecap="square" stroke-linejoin="round"/>
</svg>

  );
}

export default function Lumens({ patchData, patchRef, patchColor, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: position?.right ? 'flex-end' : 'flex-start'
  };

  const textStyle = {
    marginLeft: '15px',
    marginBottom: '-5px',
    textAlign: isRoomDecor ? (position?.right ? 'right' : 'left') : 'center'
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      { !isRoomDecor && <IconSVG color={patchColor} /> }
      <div style={textStyle}>
        <div>{patchData}</div>
        <div>ЛМ</div>
      </div>
    </div>
  );
}