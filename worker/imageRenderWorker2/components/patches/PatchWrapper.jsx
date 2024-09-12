import React from 'react';
import Text from './Text';
import RemoteControlled from './RemoteControlled';
import LampCount from './LampCount';
import Switch from './Switch';
import Area from './Area';
import BulbSize from './BulbSize';
import BulbIncludedSize from './BulbIncludedSize';
import CategoryTitle from './CategoryTitle';
import Power from './Power';
import Guarantee from './Guarantee';
import WireLength from './WireLength';
import StretchyCeiling from './StretchyCeiling';
import LowCeiling from './LowCeiling';

const PatchWrapper = ({ patchName, patchData, patchColor, style, patchRef, position }) => {
  let PatchComponent;

  let patchFromName = {
    'CategoryTitle': CategoryTitle,
    'Text': Text,
    'RemoteControlled': RemoteControlled,
    'LampCount': LampCount,
    'Switch': Switch,
    'Area': Area,
    'BulbSize': BulbSize,
    'BulbIncludedSize': BulbIncludedSize,
    'Power': Power,
    'Guarantee': Guarantee,
    'WireLength': WireLength,
    'StretchyCeiling': StretchyCeiling,
    'LowCeiling': LowCeiling,
  }
  
  PatchComponent = patchFromName[patchName];

  if (!PatchComponent) {
    throw `unknown patch name: "${patchName}"`
  }

  let wrapperStyle = {
    position: 'absolute',
    ...style,
  };

  wrapperStyle = {
    ...wrapperStyle,
    backgroundColor: '#fff8',
    boxShadow: '#0003 0 2px 2px',
    padding: '30px 60px',
    border: '1px solid #023897',
    borderRadius: '1000000px',
  }

  if (style.right) {
    wrapperStyle.paddingRight = `1000px`
    wrapperStyle.marginRight = `calc(-1000px + 60px)`
  } else {
    wrapperStyle.paddingLeft = `1000px`
    wrapperStyle.marginLeft = `calc(-1000px + 60px)`
  }

  return (
    <div style={wrapperStyle}>
      <PatchComponent patchData={patchData} patchColor={patchColor} position={{right: style.right, left: style.left}} patchRef={patchRef} />
    </div>
  );
};

export default PatchWrapper;
