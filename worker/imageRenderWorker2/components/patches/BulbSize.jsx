import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="39" height="55" viewBox="0 0 39 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.0325 52.1549C11.0325 53.6609 12.2549 54.893 13.7489 54.893H24.6144C26.1084 54.893 27.3308 53.6609 27.3308 52.1549V49.4168H11.0325V52.1549ZM19.1816 0.130859C8.69642 0.130859 0.166992 8.72852 0.166992 19.2976C0.166992 25.8143 3.39948 31.537 8.31613 35.0144V41.2025C8.31613 42.7085 9.5385 43.9406 11.0325 43.9406H27.3308C28.8248 43.9406 30.0472 42.7085 30.0472 41.2025V35.0144C34.9638 31.537 38.1963 25.8143 38.1963 19.2976C38.1963 8.72852 29.6669 0.130859 19.1816 0.130859ZM26.9233 30.5239L24.6144 32.1667V38.4644H13.7489V32.1667L11.44 30.5239C7.77285 27.9501 5.59975 23.7607 5.59975 19.2976C5.59975 11.7404 11.6844 5.60708 19.1816 5.60708C26.6788 5.60708 32.7635 11.7404 32.7635 19.2976C32.7635 23.7607 30.5904 27.9501 26.9233 30.5239Z" fill={color}/>
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
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <IconSVG color={patchColor} />
      <div style={textStyle}>{patchData}</div>
    </div>
  );
}
