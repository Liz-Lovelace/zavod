import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="53" height="35" viewBox="0 0 53 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.166992 2.51465H52.167M0.166992 17.7676H52.167M0.166992 33.0205H52.167" stroke={color} stroke-width="3.75" stroke-linejoin="bevel"/>
    </svg>

  );
}

export default function Phases({ patchData, patchRef, patchColor, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';
  const isThreePhase = patchData != "ОДНОФАЗНЫЙ";

  const patchStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: position?.right ? 'flex-end' : 'flex-start'
  };

  const textStyle = {
    marginLeft: isThreePhase ? '15px' : '0',
    textAlign: isRoomDecor ? position?.right ? 'right' : 'left' : 'left',
  };

  const displayText = isThreePhase ? "3х-ФАЗНЫЙ" : "1-ФАЗНЫЙ";

  return (
    <div ref={patchRef} style={patchStyle}>
      {isThreePhase && !isRoomDecor && <IconSVG color={patchColor} />}
      <div style={textStyle}>{displayText}</div>
    </div>
  );
}