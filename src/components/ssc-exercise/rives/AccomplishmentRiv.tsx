'use client';
import {useRive} from '@rive-app/react-canvas';

export default function AccomplishmentRiv() {
  const {RiveComponent: GoodJob} = useRive({
    src: '/assets/riv/geckograttis.riv',
    autoplay: true,
  });

  return (
      <GoodJob style={{width: '200px', height: '200px'}} />
  );
}
