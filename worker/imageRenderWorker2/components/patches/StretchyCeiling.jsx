import React from 'react';

export default function({ patchData, patchColor, patchRef, position}) {
  let color = '#013eb1'
  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    paddingTop: '0.1em',
    borderTop: `4px solid ${patchColor}`,
    textAlign: position.right ? 'right' : 'left',
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      <div>
        <div> ДЛЯ НАТЯЖНЫХ </div>
        <div> ПОТОЛКОВ </div>
      </div>
    </div>
  );
}
