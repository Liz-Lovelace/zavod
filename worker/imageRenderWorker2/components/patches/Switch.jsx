import React from 'react';

function IconSVG({ color }) {
  // Placeholder for the icon
  return (
    <svg width="77" height="77" viewBox="0 0 77 77" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M40.5 62V15H60C61.1046 15 62 15.8954 62 17V60C62 61.1046 61.1046 62 60 62H40.5ZM36.5 15V62H17C15.8954 62 15 61.1046 15 60V17C15 15.8954 15.8954 15 17 15H36.5Z" stroke={color} stroke-width="4"/>
<path d="M75 15V62C75 69.1797 69.1797 75 62 75H38.5H15C7.8203 75 2 69.1797 2 62V15C2 7.8203 7.8203 2 15 2H38.5H62C69.1797 2 75 7.8203 75 15Z" stroke={color} stroke-width="4"/>
</svg>

  );
}

export default function Switch({ patchData, patchRef, patchColor, shop, position }) {
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
        <div>ВЫКЛЮЧАТЕЛЬ</div>
        <div style={subTextStyle}>МОЖНО ПОДКЛЮЧИТЬ</div>
      </div>
    </div>
  );
}

