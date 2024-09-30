import React from 'react';

function DoubleColorToneIconSVG({ color, toneColor}) {
  let style = {
    marginRight: '10px',
  }

  return (
    <svg width="46" height="45" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <circle cx="22.667" cy="22.5" r="22.5" fill={toneColor}/>
    <circle cx="22.667" cy="22.5" r="21.5" stroke={color} strokeOpacity="0.7" strokeWidth="2"/>
    </svg>
  );
}

export default function DoubleColorTone({ tone1, tone2, patchRef, patchColor, toneColor1, toneColor2, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isRoomDecor ? position?.right ? 'flex-end' : 'flex-start' : 'flex-start',
  };

  const textStyle = {
    display: 'flex',
    marginBottom: '5px',
    marginLeft: 0,
    alignItems: 'center',
  };


  return (
    <div ref={patchRef} style={patchStyle}>
        <div style={textStyle}>
          {!isRoomDecor && <DoubleColorToneIconSVG color={patchColor} toneColor={toneColor1} />} {tone1} </div>
        <div style={textStyle}>{!isRoomDecor && <DoubleColorToneIconSVG color={patchColor} toneColor={toneColor2} />} {tone2}
        </div>
    </div>
  );
}