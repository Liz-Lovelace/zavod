import React from 'react';

function TemperatureIconSVG({ color, temperatureColor }) {
  return (
    <svg width="55" height="114" viewBox="0 0 55 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.16699" y="1" width="52" height="112" rx="13" fill={temperatureColor} stroke={color} strokeWidth="2"/>
    </svg>
  );
}

export default function SingleColorTemperature({ patchData, patchRef, patchColor, temperatureColor, shop, position }) {
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
      {!isRoomDecor && <TemperatureIconSVG color={patchColor} temperatureColor={temperatureColor} />}
      <div style={textStyle}>
        <div>{patchData}k</div>
        <div style={subTextStyle}>ЦВЕТОВАЯ</div>
        <div style={subTextStyle}>ТЕМПЕРАТУРА</div>
      </div>
    </div>
  );
}