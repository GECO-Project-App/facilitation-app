'use client';
import {useRive} from '@rive-app/react-canvas';

export default function StopGecko() {
  const {RiveComponent: StopChapter} = useRive({
    src: '/assets/riv/stopgecko.riv',
    autoplay: true,
  });

  return (
      <StopChapter style={{width: '160px', height: '160px'}}    />
  );
}
