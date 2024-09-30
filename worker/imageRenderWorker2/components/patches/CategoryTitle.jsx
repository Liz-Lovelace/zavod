import React from 'react';

export default function({ patchData, style, shop }) {
  let patchStyle = {
    fontSize: '60px',
    fontWeight: 400,
    maxWidth: '700px',
    lineHeight: 1,
    width: 'min-content',
    ...style,
  };

  if (patchData.split(' ').length !== 1) {
    patchStyle.minWidth = '400px' 
  }

  let shadowStyle = {};

  if (shop === 'donplafon') {
    patchStyle = {
      ...patchStyle,
      zoom: 1.3,
      maxWidth: '800px',
      backgroundImage: 'linear-gradient(135deg, #34525c, #4b9199 75%, #34525c)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      paddingTop: '14px',
      position: 'relative',
      zIndex: 1,
    };

    shadowStyle = {
      ...patchStyle,
      position: 'absolute',
      zIndex: 0,
      color: 'white',
      textShadow: 'rgb(255, 255, 255) 3px 0px 0px, rgb(255, 255, 255) 2.83487px 0.981584px 0px, rgb(255, 255, 255) 2.35766px 1.85511px 0px, rgb(255, 255, 255) 1.62091px 2.52441px 0px, rgb(255, 255, 255) 0.705713px 2.91581px 0px, rgb(255, 255, 255) -0.287171px 2.98622px 0px, rgb(255, 255, 255) -1.24844px 2.72789px 0px, rgb(255, 255, 255) -2.07227px 2.16926px 0px, rgb(255, 255, 255) -2.66798px 1.37182px 0px, rgb(255, 255, 255) -2.96998px 0.42336px 0px, rgb(255, 255, 255) -2.94502px -0.571704px 0px, rgb(255, 255, 255) -2.59586px -1.50383px 0px, rgb(255, 255, 255) -1.96093px -2.27041px 0px, rgb(255, 255, 255) -1.11013px -2.78704px 0px, rgb(255, 255, 255) -0.137119px -2.99686px 0px, rgb(255, 255, 255) 0.850987px -2.87677px 0px, rgb(255, 255, 255) 1.74541px -2.43999px 0px, rgb(255, 255, 255) 2.44769px -1.73459px 0px, rgb(255, 255, 255) 2.88051px -0.838247px 0px' + ', #0005 5px 4px 8px',
    };
  } else if (shop === 'roomdecor') {
    patchStyle = {
      ...patchStyle,
      marginTop: '105px',
      zoom: 1.2,
      lineHeight: 1.19,
      color: '#1d0156',
    };
  }
  return (
    <div style={{ position: 'relative' }}>
      {shop === 'donplafon' && <div style={shadowStyle}>{patchData}</div>}
      <div style={patchStyle}>{patchData}</div>
    </div>
  );
};

