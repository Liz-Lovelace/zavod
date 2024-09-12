import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="41" height="87" viewBox="0 0 41 87" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.2069 2.91422L19.3456 1.86298L5.30113 47.2388L4.09804 51.1258H8.16699H16.9936L15.1273 84.3316L20.9832 85.4037L35.0276 40.9464L36.2609 37.0427H32.167H23.336L25.2069 2.91422Z" stroke={color} stroke-width="6" stroke-linecap="round"/>
    </svg>

  );
}

export default function({ patchData, patchRef }) {
  let color = '#013eb1'
  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
  };

  const textStyle = {
    marginLeft: '5px',
    marginBottom: '-5px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <IconSVG color={color} />
      <div style={textStyle}>
        <div>{patchData}</div>
        <div> ВТ </div>
      </div>
    </div>
  );
}
