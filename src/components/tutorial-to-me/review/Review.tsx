'use client';
import {useDoneTutorialExercise} from '@/hooks/useDoneExercise';
import {FC} from 'react';
import ReviewCompleted from './ReviewCompleted';
import ReviewNotCompleted from './ReviewNotCompleted';

const Review: FC = () => {
  const {isAllDone} = useDoneTutorialExercise();
  return <>{isAllDone ? <ReviewCompleted /> : <ReviewNotCompleted />}</>;
};

export default Review;
