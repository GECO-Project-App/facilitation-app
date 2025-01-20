'use client';
import {TTMSwipe} from '@/components';
import {TTMReview} from '@/components/TTMReview';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus, PendingUser} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function TTMExercisesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status') as ExerciseStatus;
  const router = useRouter();
  const {exercise, getExerciseById, getUserExerciseData, getPendingUsers, pendingUsers} =
    useExerciseStore();
  const t = useTranslations();

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
    }
    if (id && exercise) {
      getUserExerciseData(id);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingUsers, router]);

  useEffect(() => {
    if (id && (status === 'reviewing' || status === 'writing')) {
      getPendingUsers(id, status);
    }
  }, [id, status, getPendingUsers, router, exercise]);

  if (!exercise || !id) {
    return <div>loading...</div>;
  }

  if (pendingUsers && pendingUsers.length > 0) {
    return (
      <WaitingFor
        deadline={new Date(exercise.deadline[exercise.status])}
        text={t(`common.waitingStatus.${status}`, {
          people: pendingUsers.map((user: PendingUser) => user.profile_name).join(', '),
        })}
      />
    );
  }

  switch (status as ExerciseStatus) {
    case 'writing':
      return <TTMSwipe deadline={new Date(exercise.deadline[exercise.status])} />;

    case 'reviewing':
      return <TTMReview />;
    case 'completed':
      return <div>completed</div>;
  }
}
