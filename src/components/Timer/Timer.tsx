'use client';
import {Pause, Restart, Start} from '@/components/icons/timer';
import {cn} from '@/lib/utils';
import {FC, useCallback, useEffect, useState} from 'react';

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
    <section className="flex flex-row justify-center gap-4 w-full items-center ">
      <button onClick={resetTimer} className="pt-2">
        <Restart />
      </button>

      <section className="shadow-dark rounded-full px-6 py-2 border-2 border-black bg-white ">
        <h4
          className={cn(
            'text-2xl font-semibold',
            countdown <= 10 ? 'text-red' : 'text-green',
            countdown === 0 ? 'text-amber' : '',
          )}>
          {formatTime()}
        </h4>
      </section>
      <button onClick={toggle} className="pt-2">
        {isRunning ? <Pause /> : <Start />}
      </button>
    </section>
  );
};
