import { registerRoot } from 'remotion';
import { Composition, AbsoluteFill } from 'remotion';
import { Main } from './components/Main.jsx';
import './utils/load-fonts.mjs';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={345}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          title: 'Потолочная люстра',
          flavorTexts: [
            'Место в интерьере: Для спальни',
            'Стиль: Хай-тек',
            'Страна: Великобритания',
          ],
          images: [
          {
            averageEdgeColor: '123|123|123',
            downloadURL: 'https://partners.donplafon.ru/upload/iblock/9a0/p5n0qjsvhtbv1e3xdbenah4h2mslyr67/podvesnaya_lyustra_lussole_conecuh_lsp_7217.jpg',
          },
          {
            averageEdgeColor: '123|123|123',
            downloadURL: 'https://partners.donplafon.ru/upload/iblock/a2f/9108y29udgywvdjcchbf12zz5w7qgr9t/lsp_7217_1.jpg',
          },
          {
            averageEdgeColor: '123|123|123',
            downloadURL: 'https://partners.donplafon.ru/upload/iblock/40d/3bhou3fnhfzvxgrzcazccgeqdvdsqvwl/lsp_7217_3.jpg',
          },
          ],
        }}
      />
    </>
  );
};
/*
            '',
            '',
            '',
            'https://partners.donplafon.ru/upload/iblock/1a0/oaqo0d1o20kbviype0rr5vzih80ct8zj/lsp_7217_4.jpg',
            */

registerRoot(RemotionRoot);
