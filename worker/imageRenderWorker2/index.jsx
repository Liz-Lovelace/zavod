import { Still, AbsoluteFill, registerRoot, Img } from 'remotion';
import './utils/load-fonts.mjs';
import { Main } from './components/Main.jsx';
import config from '../config.mjs';

export const RemotionRoot = () => {
  return (
    <>
      <Still
        id="Main"
        width={1080}
        height={1080}
        component={Main}>
      </Still>
    </>
  );
};

registerRoot(RemotionRoot);
