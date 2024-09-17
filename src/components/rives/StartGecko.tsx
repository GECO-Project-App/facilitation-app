'use client';
import {useRive} from '@rive-app/react-canvas';

export default function StartGecko() {
  const {RiveComponent: StartChapter} = useRive({
    src: '/assets/riv/startgecko.riv',
    autoplay: true,
  });

  return (
      <StartChapter style={{width: '160px', height: '160px'}}    />
  );
}
