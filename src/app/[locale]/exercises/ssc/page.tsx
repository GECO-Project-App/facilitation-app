'use client';
import {SSCSwipe, SwipeReview} from '@/components';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus, PendingUser} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useCallback, useEffect} from 'react';

export default function SSCPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status') as ExerciseStatus;
  const {exercise, getExerciseById, getUserExerciseData, pendingUsers, getPendingUsers} =
    useExerciseStore();
  const router = useRouter();
  const {user} = useUserStore();
  const t = useTranslations();

  useEffect(() => {
    if (id) {
      if (!exercise) {
        const getExercise = async () => {
          const {exercise} = await getExerciseById(id);
          if (exercise) {
            router.push(`ssc?id=${id}&status=${exercise.status}`);
          }
        };

        getExercise();
        return;
      }
      getUserExerciseData(id);
      router.push(`ssc?id=${id}&status=${exercise.status}`);
    } else {
      router.push(`ssc`);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingUsers, router, status]);

  const fetchPendingUsers = useCallback(async () => {
    if (!id || !exercise?.status) return;
    await getPendingUsers(id, exercise.status);
  }, [id, exercise?.status, getPendingUsers]);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  if (!id || !exercise?.id) {
    return <div>loading...</div>;
  }

  if (!pendingUsers.some((pendingUser: PendingUser) => pendingUser.user_id === user?.id)) {
    return (
      <WaitingFor
        deadline={new Date(exercise.deadline[exercise.status])}
        text={t.rich(`common.waitingStatus.${status}`, {
          underline: (chunks) => <b>{chunks}</b>,
          people: pendingUsers.map((user: PendingUser) => user.profile_name).join(', '),
        })}
      />
    );
  }

  switch (status as ExerciseStatus) {
    case 'writing':
      return <SSCSwipe deadline={new Date(exercise.deadline[exercise.status])} />;

    case 'reviewing':
      return <SwipeReview />;
    case 'completed':
      return <h2>completed</h2>;
  }
}
