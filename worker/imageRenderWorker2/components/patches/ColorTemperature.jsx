import React from 'react';
import kelvinToRgb from 'kelvin-to-rgb';
import SingleColorTemperature from './SingleColorTemperature';
import DoubleColorTemperature from './DoubleColorTemperature';

export default function ColorTemperature({ patchData, patchRef, patchColor, shop, position }) {
  const temperatures = parsePatchData(patchData);
  
  if (temperatures.length === 1) {
    const temperatureColor = `rgb(${kelvinToRgb(temperatures[0]).join(',')})`;
    return (
      <SingleColorTemperature
        patchData={temperatures[0]}
        patchRef={patchRef}
        patchColor={patchColor}
        temperatureColor={temperatureColor}
        shop={shop}
        position={position}
      />
    );
  } else if (temperatures.length === 2) {
    const temperatureColor1 = `rgb(${kelvinToRgb(temperatures[0]).join(',')})`;
    const temperatureColor2 = `rgb(${kelvinToRgb(temperatures[1]).join(',')})`;
    return (
      <DoubleColorTemperature
        temperature1={temperatures[0]}
        temperature2={temperatures[1]}
        patchRef={patchRef}
        patchColor={patchColor}
        temperatureColor1={temperatureColor1}
        temperatureColor2={temperatureColor2}
        shop={shop}
        position={position}
      />
    );
  } else {
    console.error('Invalid temperature data:', patchData);
    return null;
  }
}

// Helper function to parse patchData
function parsePatchData(patchData) {
  if (typeof patchData === 'number') {
    return [patchData];
  }
  
  const parts = patchData.split(/[/-]/);
  if (parts.length === 1) {
    return [parseInt(parts[0], 10)];
  } else if (parts.length === 2) {
    return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
  } else if (parts.length > 2) {
    return [parseInt(parts[0], 10), parseInt(parts[parts.length - 1], 10)];
  }
  
  return [];
}