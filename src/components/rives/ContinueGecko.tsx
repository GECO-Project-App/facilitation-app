'use client';
import {useRive} from '@rive-app/react-canvas';

export default function ContinueGecko() {
  const {RiveComponent: ContinueChapter} = useRive({
    src: '/assets/riv/continuegecko.riv',
    autoplay: true,
  });

  return (
      <ContinueChapter style={{width: '160px', height: '160px'}}    />
  );
}
