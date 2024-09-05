'use client';
import {FC, useCallback, useEffect, useState} from 'react';
import {StylizedContainer} from '../StylizedContainer';
import {AnimatedEyes} from '../AnimatedEyes/AnimatedEyes';

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
    <StylizedContainer className="bg-white">
      <p className="text-center text-4xl font-bold">{formatTime()}</p>
      <AnimatedEyes />
    </StylizedContainer>
  );
};
