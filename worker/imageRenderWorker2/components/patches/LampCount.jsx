import React from 'react';

export function multipleNoun(number, one, two, five) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}

function IconSVG({ color }) {
  return (
    <svg width="39" height="56" viewBox="0 0 39 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6531 52.2741C11.6531 53.78 12.8755 55.0122 14.3695 55.0122H25.235C26.729 55.0122 27.9514 53.78 27.9514 52.2741V49.536H11.6531V52.2741ZM19.8022 0.25C9.31703 0.25 0.787598 8.84766 0.787598 19.4168C0.787598 25.9335 4.02009 31.6561 8.93673 35.1335V41.3216C8.93673 42.8276 10.1591 44.0597 11.6531 44.0597H27.9514C29.4454 44.0597 30.6678 42.8276 30.6678 41.3216V35.1335C35.5844 31.6561 38.8169 25.9335 38.8169 19.4168C38.8169 8.84766 30.2875 0.25 19.8022 0.25ZM27.5439 30.643L25.235 32.2859V38.5835H14.3695V32.2859L12.0606 30.643C8.39346 28.0692 6.22035 23.8799 6.22035 19.4168C6.22035 11.8596 12.305 5.72622 19.8022 5.72622C27.2995 5.72622 33.3841 11.8596 33.3841 19.4168C33.3841 23.8799 31.211 28.0692 27.5439 30.643Z" fill={color}/>
</svg>

  );
}

export default function({ patchData, patchRef, patchColor, shop }) {
  const isRoomDecor = shop === 'roomdecor';

  const patchStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    ...(isRoomDecor && { flexDirection: 'row-reverse' }),
  };

  const textStyle = {
    ...(isRoomDecor ? {} : { marginRight: '15px' }),
  };

  let text = `${patchData} ${multipleNoun(parseInt(patchData), 'ЛАМПА', 'ЛАМПЫ', 'ЛАМП')}`

  return (
    <div ref={patchRef} style={patchStyle}>
      <div style={textStyle}>{text}</div>
      {!isRoomDecor && <IconSVG color={patchColor} />}
    </div>
  );
}
