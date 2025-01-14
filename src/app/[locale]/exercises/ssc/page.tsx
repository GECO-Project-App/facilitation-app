'use client';
import {About, SSCSwipe} from '@/components';
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

  if (!id || !exercise?.id) {
    return (
      <About
        slug="ssc"
        title="ssc.title"
        subtitle="ssc.subtitle"
        description="ssc.description"
        buttonText="ssc.button"
        hideTeamSelect
      />
    );
  }

  return <SSCSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
}
