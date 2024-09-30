import React from 'react';

function DoubleTemperatureIconSVG({ color, temperatureColor}) {
  let style = {
    marginRight: '5px',
  }

  return (
    <svg width="46" height="45" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <circle cx="22.667" cy="22.5" r="22.5" fill={temperatureColor}/>
    <circle cx="22.667" cy="22.5" r="21.5" stroke={color} strokeOpacity="0.7" strokeWidth="2"/>
    </svg>
  );
}

export default function DoubleColorTemperature({ temperature1, temperature2, patchRef, patchColor, temperatureColor1, temperatureColor2, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: position?.right ? 'flex-end' : 'flex-start',
  };

  const textStyle = {
    marginLeft: '15px',
    display: 'flex',
    marginLeft: 0,
  };

  const subTextStyle = {
    marginTop: '8px',
    marginBottom: '-3px',
    fontSize: '35px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
        <div style={textStyle}>{!isRoomDecor && <DoubleTemperatureIconSVG color={patchColor} temperatureColor={temperatureColor1} />}{temperature1}k -&nbsp;{!isRoomDecor && <DoubleTemperatureIconSVG color={patchColor} temperatureColor={temperatureColor2} />}{temperature2}k</div>
        <div style={subTextStyle}>ЦВЕТОВАЯ ТЕМПЕРАТУРА</div>
    </div>
  );
}