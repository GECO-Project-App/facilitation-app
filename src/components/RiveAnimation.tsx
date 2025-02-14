'use client';
import {useRive, UseRiveParameters} from '@rive-app/react-canvas';
import {useEffect} from 'react';

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

  useEffect(() => {
    if (rive && stateMachines && triggers && autoplay) {
      // rive.on(EventType.StateChange, (event) => {
      //   console.log(event.data);
      // });
      const input = rive
        .stateMachineInputs(stateMachines?.[0])
        ?.find((i) => i.name === triggers?.[0]);

      if (input) {
        input.fire();
      }
    }
  }, [rive]);

  return <RiveComponent style={{width, height}} className={className} />;
};
