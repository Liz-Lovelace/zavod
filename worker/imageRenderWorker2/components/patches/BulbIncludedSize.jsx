import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="53" height="77" viewBox="0 0 48 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.585 64.5127C13.585 66.3577 15.0945 67.8672 16.9395 67.8672H30.3574C32.2024 67.8672 33.7119 66.3577 33.7119 64.5127V61.1582H13.585V64.5127ZM23.6484 0.777344C10.7001 0.777344 0.166992 11.3104 0.166992 24.2588C0.166992 32.2425 4.15884 39.2534 10.2305 43.5136V51.0947C10.2305 52.9397 11.74 54.4492 13.585 54.4492H33.7119C35.5569 54.4492 37.0664 52.9397 37.0664 51.0947V43.5136C43.138 39.2534 47.1299 32.2425 47.1299 24.2588C47.1299 11.3104 36.5968 0.777344 23.6484 0.777344ZM33.2087 38.0122L30.3574 40.0249V47.7402H16.9395V40.0249L14.0881 38.0122C9.55957 34.859 6.87598 29.7266 6.87598 24.2588C6.87598 15.0004 14.39 7.48633 23.6484 7.48633C32.9068 7.48633 40.4209 15.0004 40.4209 24.2588C40.4209 29.7266 37.7373 34.859 33.2087 38.0122Z" fill={color}/>
</svg>
  );
}

export default function({ patchData, patchRef, patchColor }) {
  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
  };

  const textStyle = {
    marginLeft: '15px',
    marginBottom: '-9px',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <IconSVG color={patchColor} />
      <div style={textStyle}>
        <div>{patchData}</div>
        <div style={{fontSize: '35px'}}> В КОМПЛЕКТЕ </div>
      </div>
    </div>
  );
}
