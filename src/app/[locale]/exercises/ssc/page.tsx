'use client';
import {SSCSwipe} from '@/components';
import {useExerciseStore} from '@/store/exerciseStore';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function SSCPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {exercise, getExerciseById} = useExerciseStore();

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
    }
  }, [id, exercise, getExerciseById]);

  console.log(exercise?.deadline);
  if (!exercise?.id) {
    return <div>Exercise not found</div>;
  }

  return <SSCSwipe deadline={new Date(exercise.deadline.writing)} />;
}
