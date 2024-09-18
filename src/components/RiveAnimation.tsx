'use client';
import {useRive, UseRiveParameters} from '@rive-app/react-canvas';

type RiveComponentProps = UseRiveParameters & {
  width?: string | number;
  height?: string | number;
};

export const RiveAnimation = ({
  src = 'assets/riv/placeholder.riv',
  autoplay = true,
  width = '200px',
  height = '200px',
  ...riveProps
}: RiveComponentProps) => {
  const {RiveComponent} = useRive({
    src,
    autoplay,
    ...riveProps,
  });

  return <RiveComponent style={{width, height}} />;
};
