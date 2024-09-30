import React from 'react';

function RGBColorToneIconSVG({ color }) {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1.16699" y="1.5" width="43" height="43" rx="8" fill="url(#paint0_linear_237_5962)" stroke={color} stroke-width="2"/>
<defs>
<linearGradient id="paint0_linear_237_5962" x1="-4.83301" y1="-3.5" x2="41.667" y2="42.5" gradientUnits="userSpaceOnUse">
<stop offset="0.05" stop-color="#FF0000"/>
<stop offset="0.263" stop-color="#FF5E00"/>
<stop offset="0.408" stop-color="#FFF200"/>
<stop offset="0.538" stop-color="#1AFF00"/>
<stop offset="0.658" stop-color="#00F7FF"/>
<stop offset="0.815" stop-color="#3C00FF"/>
<stop offset="0.93" stop-color="#EE00FF"/>
</linearGradient>
</defs>
</svg>

  );
}

export default function RGBColorTone({ patchRef, patchColor, shop, position }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const textStyle = {
    marginLeft: '10px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      {!isRoomDecor && <RGBColorToneIconSVG color={patchColor} />}
      <div style={textStyle}>RGB</div>
    </div>
  );
}