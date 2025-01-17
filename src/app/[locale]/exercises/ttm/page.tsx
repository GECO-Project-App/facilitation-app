'use client';
import {TTMSwipe} from '@/components';
import {TTMReview} from '@/components/TTMReview';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus, PendingUsers} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useSearchParams} from 'next/navigation';
import {useCallback, useEffect} from 'react';

export default function TTMExercisesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status') as ExerciseStatus;
  const router = useRouter();
  const {exercise, getExerciseById, getUserExerciseData, getPendingUsers, pendingUsers} =
    useExerciseStore();

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
    }
    if (id && exercise) {
      getUserExerciseData(id);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingUsers, router]);

  useCallback(() => {
    if (id && status) {
      getPendingUsers(id, status);
    }
  }, [id, status, getPendingUsers]);

  if (!exercise || !id) {
    return <div>loading...</div>;
  }

  if (pendingUsers) {
    return (
      <WaitingFor
        deadline={new Date(exercise.deadline[exercise.status])}
        people={pendingUsers.map((user: PendingUsers) => user.profile_name)}
      />
    );
  }

  switch (status) {
    case 'writing':
      return <TTMSwipe deadline={new Date(exercise.deadline[exercise.status])} />;

    case 'reviewing':
      return <TTMReview />;
  }
}
