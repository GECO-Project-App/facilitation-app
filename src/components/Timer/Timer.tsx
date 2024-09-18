'use client';
import {FC, useCallback, useEffect, useState} from 'react';
import {StylizedContainer} from '../StylizedContainer';
import {AnimatedEyes} from '../AnimatedEyes/AnimatedEyes';
import {cn} from '@/lib/utils';
import {Restart} from '@/components/icons/timer';

type TimerProps = {
  seconds?: number;
};

export const Timer: FC<TimerProps> = ({seconds = 60}) => {
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
    <div className="flex flex-col gap-4">
      <StylizedContainer className="bg-white">
        <button onClick={toggle}>
          <p
            className={cn(
              seconds === countdown ? 'text-green-500' : '',
              countdown === 0 ? 'text-amber-500' : '',
            )}>
            {formatTime()}
          </p>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <AnimatedEyes />
          </div>
        </button>
      </StylizedContainer>
      <button onClick={resetTimer}>
        <Restart />
      </button>
      <button onClick={toggle}>Start</button>
    </div>
  );
};
