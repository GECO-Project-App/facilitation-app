'use client';
import {TTMSwipe} from '@/components';
import {TTMReview} from '@/components/TTMReview';
import {WaitingFor} from '@/components/WaitingFor';
import {ExerciseStatus, PendingUsers} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function TTMExercisesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {exercise, getExerciseById} = useExerciseStore();
  const {exerciseData, getUserExerciseData, pendingUsers, getPendingSubmissions} =
    useExerciseStore();

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
    }
    if (id && exercise) {
      getUserExerciseData(id);
      getPendingSubmissions(id);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingSubmissions]);

  if (!exercise || !id) {
    return <div>loading...</div>;
  }

  if (pendingUsers) {
    return (
      <WaitingFor
        people={pendingUsers.map((user: PendingUsers) => `${user.firstName} ${user.lastName}`)}
        deadline={new Date(exercise.deadline[exercise.status])}
      />
    );
  }

  switch (searchParams.get('status') as ExerciseStatus) {
    case 'writing':
      return <TTMSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
    case 'reviewing':
      return <TTMReview />;
    default:
      return <div>loading</div>;
  }
}
