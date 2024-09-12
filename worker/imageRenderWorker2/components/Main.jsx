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
}

export function Main({ downloadURL, patches, categoryTitle, medianEdgeBrightness, averageEdgeColor}) {
  /*
  downloadURL = 'https://source-image-cache.ams1.vultrobjects.com/aHR0cHM6Ly9wYXJ0bmVycy5kb25wbGFmb24ucnUvdXBsb2FkL2libG9jay8zYWUvbmZ0ZjJ3c3J3bXA5eHRoeWNoMWNvNHVnbXB6a2IwdmQvcG9kdmVzbmF5YV9seXVzdHJhX2x1c3NvbGVfY3JlbnNoYXdfbHNwXzcwMDkuanBn.jpg';

  patches = [
    { patchName: 'WireLength', patchData: '1 month' },
    { patchName: 'Area', patchData: '1' },
  ]
  categoryTitle = 'bruhaaaaaaaaaaaac'
  medianEdgeBrightness = 255;
  */

  let backgroundColor = (medianEdgeBrightness == 255 || medianEdgeBrightness == 0) ?
    `rgb(${medianEdgeBrightness}, ${medianEdgeBrightness}, ${medianEdgeBrightness})`
    : `rgb(${averageEdgeColor[0]}, ${averageEdgeColor[1]}, ${averageEdgeColor[2]})`


  let topStyle = {
    fontFamily: 'handel',
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
    
    let sortedPatches = [...patchList].sort((a, b) => {
      const aWidth = sizes[patchList.indexOf(a)]?.width || 0;
      const bWidth = sizes[patchList.indexOf(b)]?.width || 0;

      return bWidth - aWidth;
    });

    if (sortedPatches.length > 2) {
      sortedPatches = sortedPatches.filter((patch, index) => {
        if (index >= 2) {
          const patchWidth = sizes[patchList.indexOf(patch)]?.width || 0;
          return patchWidth <= 290;
        }
        return true;
      });
    }    
    setRenderPatchList(sortedPatches);
  };

  let extraStyles = {
    color: colors.homedecor,
    fontSize: '50px',
    lineHeight: 1,
    zoom: '0.85',
  }

  let categoryTitleStyle = {
    color: colors.homedecor,
    top: '40px',
  };

  return (
    <div style={topStyle}>
      <Img src={downloadURL} style={imgStyle} />
      <Img src={staticFile('homedecor-bg.png')}  />
      <PatchWrapper
        key={-1}
        patchName='CategoryTitle'
        patchData={categoryTitle.toUpperCase()}
        style={categoryTitleStyle}
        patchRef={null}
      />
      {renderPatchList.slice(0, 3).map(({ patchData, patchName }, index) => (
        <PatchWrapper
          key={index}
          patchName={patchName}
          patchData={patchData.toUpperCase()}
          patchColor={colors.homedecor}
          style={{ ...patchPositions[index], ...extraStyles }}
          patchRef={null}
        />
      ))}
      <PatchMeasurer patchList={patchList} style={extraStyles} onPatchSizesMeasured={handlePatchSizesMeasured} />
    </div>
  );
      // <Img src={staticFile('ozon-overlay.png')} style={{position: 'absolute', top: 0}}  />
}
