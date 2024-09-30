import React, { useState, useRef } from 'react';
import { Img, staticFile } from 'remotion';
import PatchWrapper from './patches/PatchWrapper';
import { PatchMeasurer } from './PatchMeasurer';
import CategoryTitle from './CategoryTitle'

const patchPositions = [
  { bottom: '220px', left: '0px' },
  { top: '240px', right: '0px' },
  { bottom: '60px', right: '0px' },
];

const colors = {
  homedecor: '#013eb1',
  donplafon: '#ffffff',
  lampochki: '#023897',
  roomdecor: '#ffffff',
}

const fonts = {
  homedecor: 'handel',
  donplafon: 'pppangram',
  lampochki: 'montserrat',
  roomdecor: 'futura',
}

const overlays = {
  homedecor: 'homedecor-bg.png',
  lampochki: 'lampochki-bg.png',
  roomdecor: 'roomdecor-bg.svg',
}

export function Main({ downloadURL, patches, categoryTitle, medianEdgeBrightness, averageEdgeColor, shop}) {
  /*
  downloadURL = 'https://source-image-cache.ams1.vultrobjects.com/aHR0cHM6Ly9wYXJ0bmVycy5kb25wbGFmb24ucnUvdXBsb2FkL2libG9jay8zYWUvbmZ0ZjJ3c3J3bXA5eHRoeWNoMWNvNHVnbXB6a2IwdmQvcG9kdmVzbmF5YV9seXVzdHJhX2x1c3NvbGVfY3JlbnNoYXdfbHNwXzcwMDkuanBn.jpg';

  patches = [
    { patchName: 'Power', patchData: '000' },
    { patchName: 'Power', patchData: '0000000000' },
    { patchName: 'Power', patchData: '000100' },
    { patchName: 'Power', patchData: '00' },
  ]
  categoryTitle = 'Настенный бра'
  medianEdgeBrightness = 255;
  // shop = 'homedecor'
  // shop = 'donplafon'
  shop = 'roomdecor'
  // shop = 'lampochki'
  */

  let backgroundColor = (medianEdgeBrightness == 255 || medianEdgeBrightness == 0) ?
    `rgb(${medianEdgeBrightness}, ${medianEdgeBrightness}, ${medianEdgeBrightness})`
    : `rgb(${averageEdgeColor[0]}, ${averageEdgeColor[1]}, ${averageEdgeColor[2]})`


  let topStyle = {
    fontFamily: fonts[shop],
    position: 'absolute',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor,
  }


  let imgWidth = '80%';
  let imgStyle = {
    width: imgWidth,
    height: imgWidth,
    left: `calc((100% - ${imgWidth})/2)`,
    top: `calc((100% - ${imgWidth})/3)`,
    position: 'absolute',
    objectFit: 'contain',
  }


  const [patchList, setPatchList] = useState(patches);
  const [renderPatchList, setRenderPatchList] = useState([]);

  const [patchSizes, setPatchSizes] = useState({});

  const handlePatchSizesMeasured = (sizes) => {
    setPatchSizes(sizes);
    
    let sortedPatches = [...patchList];
    let firstThreePatches = sortedPatches.slice(0, 3).sort((a, b) => {
      const aWidth = sizes[patchList.indexOf(a)]?.width || 0;
      const bWidth = sizes[patchList.indexOf(b)]?.width || 0;
      return bWidth - aWidth;
    });
    sortedPatches = [...firstThreePatches, ...sortedPatches.slice(3)];

    if (sortedPatches.length > 2) {
      sortedPatches = sortedPatches.filter((patch, index) => {
        if (index >= 2) {
          const patchWidth = sizes[patchList.indexOf(patch)]?.width || 0;
          return patchWidth <= 123;
        }
        return true;
      });
    }    
    setRenderPatchList(sortedPatches);
  };

  let extraStyles = {
    color: colors[shop],
    fontSize: '50px',
    lineHeight: 1,
    zoom: '0.85',
  }

  let categoryTitleStyle = {
    color: colors[shop],
    top: '40px',
  };

  return (
    <div style={topStyle}>
      <Img src={downloadURL} style={imgStyle} />
      {overlays[shop] && (
        <Img src={staticFile(overlays[shop])} style={{position: 'absolute', top: 0, mixBlendMode: 'multiply'}} />
      )}
      <PatchWrapper
        key={-1}
        patchName='CategoryTitle'
        patchData={categoryTitle.toUpperCase()}
        style={categoryTitleStyle}
        patchRef={null}
        shop={shop}
      />
      {renderPatchList.slice(0, 3).map(({ patchData, patchName }, index) => (
        <PatchWrapper
          key={index}
          patchName={patchName}
          patchData={patchData.toUpperCase()}
          patchColor={colors[shop]}
          style={{ ...patchPositions[index], ...extraStyles }}
          patchRef={null}
          shop={shop}
        />
      ))}
      <PatchMeasurer patchList={patchList} style={extraStyles} onPatchSizesMeasured={handlePatchSizesMeasured} shop={shop} />
    </div>
  );
      // <Img src={staticFile('ozon-overlay.png')} style={{position: 'absolute', top: 0}} />
}
