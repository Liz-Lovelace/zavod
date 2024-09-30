import React from 'react';

function IconSVG({ color }) {
  return (
    <svg width="48" height="69" viewBox="0 0 48 69" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32.7228 26.9289H14.6027C12.9417 26.9289 11.5827 28.2747 11.5827 29.9197V65.8092C11.5827 67.4542 12.9417 68.8 14.6027 68.8H32.7228C34.3838 68.8 35.7428 67.4542 35.7428 65.8092V29.9197C35.7428 28.2747 34.3838 26.9289 32.7228 26.9289ZM29.7027 62.8184H17.6227V32.9105H29.7027V62.8184Z" fill={color}/>
      <path d="M23.6627 41.8829C25.3306 41.8829 26.6827 40.5438 26.6827 38.8921C26.6827 37.2403 25.3306 35.9013 23.6627 35.9013C21.9948 35.9013 20.6427 37.2403 20.6427 38.8921C20.6427 40.5438 21.9948 41.8829 23.6627 41.8829Z" fill={color}/>
      <path d="M8.71364 18.106L12.9719 22.3231C15.7201 19.6313 19.4951 17.9565 23.6627 17.9565C27.8303 17.9565 31.6054 19.6313 34.3536 22.3231L38.6118 18.106C34.7764 14.3077 29.4913 11.9749 23.6627 11.9749C17.8341 11.9749 12.5491 14.3077 8.71364 18.106ZM23.6627 0.0117188C14.4819 0.0117188 6.17682 3.6904 0.166992 9.64208L4.42522 13.8591C9.34784 9.01401 16.1429 5.99331 23.6627 5.99331C31.1826 5.99331 37.9776 9.01401 42.87 13.889L47.1282 9.67199C41.1486 3.6904 32.8436 0.0117188 23.6627 0.0117188Z" fill={color}/>
    </svg>
  );
}

export default function RemoteControlled({ patchRef, patchColor, shop }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
  };

  const textStyle = {
    ...(isRoomDecor ? {} : { marginLeft: '8px' }),
  };

  return (
    <div ref={patchRef} style={patchStyle}>
      {!isRoomDecor && <IconSVG color={patchColor} />}
      <div style={textStyle}>ПУЛЬТ ДУ</div>
    </div>
  );
}
