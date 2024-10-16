'use client';
import {RiveAnimation} from '@/components/';
import {Pause, Restart, Start} from '@/components/icons/timer';
import {cn} from '@/lib/utils';
import {FC, useCallback, useEffect, useState} from 'react';
import {StylizedContainer} from '../StylizedContainer';

type TimerProps = {
  seconds?: number;
  className?: string;
};

export const Timer: FC<TimerProps> = ({seconds = 60, className}) => {
  const [countdown, setCountdown] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);

  const toggle = useCallback(() => {
    if (!isRunning && countdown === 0) {
      setCountdown(seconds);
    }
    setIsRunning((prevState) => !prevState);
  }, [countdown, isRunning, seconds]);

  const resetTimer = useCallback(() => {
    setCountdown(seconds);
    setIsRunning(false);
  }, [seconds]);

  useEffect(() => {
    let intervalId: undefined | NodeJS.Timeout;

    if (isRunning && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, countdown, setCountdown]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [countdown]);

  return (
    <div className="flex flex-col items-center gap-4">
      <StylizedContainer className={cn('bg-white', className)}>
        <section>
          <p
            className={cn(
              'text-3xl',
              seconds === countdown ? 'text-red' : '',
              countdown === 0 ? 'text-amber' : '',
            )}>
            {formatTime()}
          </p>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <RiveAnimation src="eyes.riv" width={60} />
          </div>
        </section>
      </StylizedContainer>
      <section className="flex">
        <button onClick={resetTimer}>
          <Restart />
        </button>
        <button onClick={toggle}>{isRunning ? <Pause /> : <Start />}</button>
      </section>
    </div>
  );
};
