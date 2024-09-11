'use client';
import { useRive } from '@rive-app/react-canvas';

export default function SscExplanations() {
  
  const { RiveComponent: TheSSC } = useRive({
    src: '/ssc.riv',
    autoplay: true,
  });


  return (
      <TheSSC style={{ width: '160px', height: '160px' }} />
  );
}
