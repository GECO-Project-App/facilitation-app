'use client';
import {FC, useState} from 'react';
import ReviewCompleted from './ReviewCompleted';
import ReviewNotCompleted from './ReviewNotCompleted';

const Review: FC<{message: string}> = ({message}) => {
  const [isCompleted, setIsCompleted] = useState(true);
  return (
    <>
      {isCompleted ? (
        <ReviewCompleted message={message} />
      ) : (
        <ReviewNotCompleted message={message} />
      )}
    </>
  );
};

export default Review;
