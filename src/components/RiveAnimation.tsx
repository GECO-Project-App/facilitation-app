'use client';
import {useRive, UseRiveParameters} from '@rive-app/react-canvas';

type RiveComponentProps = UseRiveParameters & {
  width?: string | number;
  height?: string | number;
  className?: string;
  triggers?: string[];
};

export const RiveAnimation = ({
  autoplay = true,
  width = 160,
  height = 160,
  className,
  triggers = [],
  src,
  stateMachines,
  ...riveProps
}: RiveComponentProps) => {
  const {rive, RiveComponent} = useRive({
    src: `/assets/riv/${src}`,
    autoplay,
    stateMachines,
    ...riveProps,
  });

  return <RiveComponent style={{width, height}} className={className} />;
};
