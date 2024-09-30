import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.16699 4.76758C2.16699 3.66301 3.06242 2.76758 4.16699 2.76758H67.167C68.2716 2.76758 69.167 3.66301 69.167 4.76758V67.7676C69.167 68.8721 68.2716 69.7676 67.167 69.7676H4.16699C3.06242 69.7676 2.16699 68.8721 2.16699 67.7676V4.76758Z" stroke={color} stroke-width="4"/>
      <circle cx="35.667" cy="36.2676" r="18.5" stroke={color} stroke-width="4"/>
    </svg>


  );
}

export default function Dimmer({ patchData, patchRef, patchColor, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: position?.right ? 'flex-end' : 'flex-start'
  };

  const textStyle = {
    marginLeft: '15px',
    textAlign: isRoomDecor ? position?.right ? 'right' : 'left' : 'left',
  };

  const subTextStyle = {
    marginTop: '3px',
    marginBottom: '-3px',
    fontSize: '35px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      {!isRoomDecor && <IconSVG color={patchColor} />}
      <div style={textStyle}>
        <div >ДИММЕР</div>
        <div style={subTextStyle}>МОЖНО ПОДКЛЮЧИТЬ</div>
      </div>
    </div>
  );
}