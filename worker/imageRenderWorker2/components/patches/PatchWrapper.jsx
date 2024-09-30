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
import RoomDecorTextPatch from './RoomDecorTextPatch';
import Country from './Country';
import Protection from './Protection';
import Diameter from './Diameter';
import Lumens from './Lumens';
import Dimmer from './Dimmer';
import ColorTemperature from './ColorTemperature';
import ColorTone from './ColorTone';
import Attachment from './Attachment';
import Bus from './Bus';
import Phases from './Phases';

const PatchWrapper = ({ patchName, patchData, patchColor, style, patchRef, position, shop }) => {
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
    'Country': Country,
    'Protection': Protection,
    'Diameter': Diameter,
    'Lumens': Lumens,
    'Dimmer': Dimmer,
    'ColorTemperature': ColorTemperature,
    'ColorTone': ColorTone,
    'Attachment': Attachment,
    'Bus': Bus,
    'Phases': Phases,
  }
  
  PatchComponent = patchFromName[patchName];

  if (!PatchComponent) {
    throw `unknown patch name: "${patchName}"`
  } 
  
  const baseStyle = {
    position: 'absolute',
    padding: '30px 60px',
    ...style,
  };

  const getHomeDecorLampochkiStyle = (style) => {
    const homeDecorStyle = {
      ...baseStyle,
      backgroundColor: '#fff8',
      boxShadow: '#0003 0 2px 2px',
      border: '1px solid #023897',
      borderRadius: '1000000px',
    };

    const paddingDirection = style.right ? 'Right' : 'Left';
    homeDecorStyle[`padding${paddingDirection}`] = '1000px';
    homeDecorStyle[`margin${paddingDirection}`] = 'calc(-1000px + 60px)';

    return homeDecorStyle;
  };

  const getDonPlafonStyle = (style, patchName) => {
    if (patchName === 'CategoryTitle') {
      return { ...baseStyle, padding: '10px 60px' };
    }

    const donPlafonStyle = {
      ...baseStyle,
      backgroundImage: 'linear-gradient(135deg, #34525c, #4b9199 85%, #34525c)',
      borderRadius: '40px',
      border: '4px solid #fff',
      boxShadow: '#0005 4px 4px 10px',
    };

    const paddingOffset = 100;
    const paddingDirection = style.right ? 'Right' : 'Left';
    donPlafonStyle[`padding${paddingDirection}`] = `${paddingOffset}px`;
    donPlafonStyle[`margin${paddingDirection}`] = `calc(-${paddingOffset}px + 60px)`;

    return donPlafonStyle;
  };

  const getRoomDecorStyle = (style) => {
    const roomDecorStyle = {
      ...baseStyle,
      // boxShadow: '#cccde5 0 2px 2px',
      transform: 'skewY(-15.9deg)',
    };

    if (patchName === 'CategoryTitle') {
      roomDecorStyle.transformOrigin = 'left';
    }

    if (style.right && style.top || style.left && style.bottom) {
      roomDecorStyle.backgroundColor = '#5791f4d0';
      roomDecorStyle.boxShadow = '#0002 10px 10px 0';
    }

    return roomDecorStyle;
  };

  const wrapperStyleFunctions = {
    homedecor: getHomeDecorLampochkiStyle,
    donplafon: getDonPlafonStyle,
    lampochki: getHomeDecorLampochkiStyle,
    roomdecor: getRoomDecorStyle,
  };

  const wrapperStyle = wrapperStyleFunctions[shop](style, patchName)

  return (
    <div style={wrapperStyle}>
      <PatchComponent patchData={patchData} shop={shop} patchColor={patchColor} position={{right: style.right, left: style.left}} patchRef={patchRef} />
    </div>
  );
};

export default PatchWrapper;
