'use client';
import {useRive} from '@rive-app/react-canvas';

export default function SscRivLandPage() {
  const {RiveComponent: TheSSC} = useRive({
    src: '/startstopcontinue.riv',
    autoplay: true,
  });

  return (
      <TheSSC style={{width: '200px', height: '200px'}} />
  );
}
