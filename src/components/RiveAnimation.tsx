'use client';
import {useRive, UseRiveParameters} from '@rive-app/react-canvas';

type RiveComponentProps = UseRiveParameters & {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export const RiveAnimation = ({
  autoplay = true,
  width = 160,
  height = 160,
  className,
  src,
  ...riveProps
}: RiveComponentProps) => {
  const {RiveComponent} = useRive({
    src: `/assets/riv/${src}`,
    autoplay,
    ...riveProps,
  });

  return <RiveComponent style={{width, height}} className={className} />;
};
