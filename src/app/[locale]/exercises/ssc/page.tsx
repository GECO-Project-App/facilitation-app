'use client';
import {GecoLoader, SSCCompleted, SSCSwipe, SwipeReview} from '@/components';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus, PendingUser} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

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
            router.push(`ssc?id=${id}&teamId=${exercise.team_id}&status=${exercise.status}`);
          }
        };

        getExercise();
        return;
      }
      getUserExerciseData(id);
      router.replace(`ssc?id=${id}&teamId=${exercise.team_id}&status=${exercise.status}`);
    } else {
      router.replace(`ssc/introduction`);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingUsers, router, status]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (!id || !exercise?.status || exercise.status === 'completed') return;
      await getPendingUsers(id, exercise.status);
    };
    fetchPendingUsers();
  }, [id, exercise?.status, getPendingUsers]);

  if (!exercise || !pendingUsers) {
    return <GecoLoader />;
  }

  if (
    (!pendingUsers.some((pendingUser: PendingUser) => pendingUser.user_id === user?.id) &&
      exercise.status !== 'completed') ||
    pendingUsers.length > 0
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
      return <SSCSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
    case 'reviewing':
      return <SwipeReview />;
    case 'completed':
      return <SSCCompleted />;
  }
}
