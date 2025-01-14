'use client';
import {TTMSwipe} from '@/components';
import {useExerciseStore} from '@/store/exerciseStore';
import {useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

export default function TTMExercisesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {exercise, getExerciseById} = useExerciseStore();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
    }
  }, [id, exercise, getExerciseById]);

  if (!exercise || !id) {
    return <div>loading</div>;
  }

  if (exercise.status === 'reviewing') {
    return <div>Feed</div>;
  }

  return <TTMSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
}
