'use client';
import {TTMSwipe} from '@/components';
import {TTMReview} from '@/components/TTMReview';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus, PendingUser} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useUserStore} from '@/store/userStore';
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
  const {user} = useUserStore();
  const t = useTranslations();

  useEffect(() => {
    if (id) {
      if (!exercise) {
        const getExercise = async () => {
          await getExerciseById(id);
        };

        getExercise();
        return;
      }
      getUserExerciseData(id);
      router.push(`ttm?id=${id}&status=${exercise.status}`);
    }
    if (id && !status) {
      router.push(`ttm?id=${id}&status=${exercise.status}`);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingUsers, router, status]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (!id || !exercise?.status || exercise.status === 'completed') return;
      await getPendingUsers(id, exercise.status);
    };
    fetchPendingUsers();
  }, [id, exercise?.status, getPendingUsers]);

  if (!exercise || !id) {
    return <div>loading...</div>;
  }

  // If the user is not in the pending users list, show the waiting for component
  if (
    !pendingUsers.some((pendingUser: PendingUser) => pendingUser.user_id === user?.id) &&
    exercise.status !== 'completed'
  ) {
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
      return <TTMSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
    case 'reviewing':
      return <TTMReview />;
    case 'completed':
      return <TTMReview isCompleted={true} />;
  }
}
