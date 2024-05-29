import { Still, AbsoluteFill, registerRoot, Img } from 'remotion';
import './utils/load-fonts.mjs';
import { StillMain } from './components/StillMain.jsx';
import config from '../config.mjs';

export const RemotionRoot = () => {
  const imgStyle = {
    width: '100%',
    height: '100%',
  };

  return (
    <>
      <Still
        id="Main"
        width={1080}
        height={1080}
        component={StillMain}>
      </Still>
    </>
  );
};

// <Img style={imgStyle} src='https://partners.donplafon.ru/upload/iblock/bb1/12jwb29nkotxir9a9adxw82p64pgilee/potolochnaya_lyustra_evoluce_raito_sle1105_402_06.jpg' />
registerRoot(RemotionRoot);
