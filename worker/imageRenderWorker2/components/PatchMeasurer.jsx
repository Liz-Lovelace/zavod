import React, { useState, useEffect, useRef } from 'react';
import PatchWrapper from './patches/PatchWrapper';

export function PatchMeasurer({ patchList, style, onPatchSizesMeasured, shop }) {
  const patchRefs = patchList.map(() => useRef(null));

  useEffect(() => {
    const sizes = {};
    patchRefs.forEach((patchRef, index) => {
      if (patchRef.current) {
        const { width, height } = patchRef.current.getBoundingClientRect();
        sizes[index] = { width, height };
      }
    });
    onPatchSizesMeasured(sizes);
  }, []);

  return (
    <div style={{ visibility: 'hidden' }}>
      {patchList.map(({ patchData, patchName }, index) => (
        <PatchWrapper
          key={index}
          patchName={patchName}
          patchData={patchData.toUpperCase()}
          patchRef={patchRefs[index]}
          style={style}
          shop={shop}
        />
      ))}
    </div>
  );
}
