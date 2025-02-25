'use client';
import {GecoLoader, TTMSwipe} from '@/components';
import {TTMReview} from '@/components/TTMReview';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus, PendingUser} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTeamStore} from '@/store/teamStore';
import {useUserStore} from '@/store/userStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function TTMExercisesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status') as ExerciseStatus;
  const router = useRouter();
  const {
    exercise,
    getExerciseById,
    getUserExerciseData,
    getPendingUsers,
    pendingUsers,
    getExerciseBySlugAndTeamId,
  } = useExerciseStore();
  const {currentTeam} = useTeamStore();
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
    } else {
      router.replace(`ttm/introduction`);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingUsers, router, status]);

  useEffect(() => {
    const getExercise = async () => {
      if (!currentTeam) return;
      const exercise = await getExerciseBySlugAndTeamId('ttm', currentTeam.id);
      if (exercise) {
        router.push(`ttm?id=${exercise.id}&status=${exercise.status}`);
      }
    };

    getExercise();
  }, [status, router, currentTeam, getExerciseBySlugAndTeamId]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (!id || !exercise?.status || exercise.status === 'completed') return;
      await getPendingUsers(id, exercise.status);
    };
    fetchPendingUsers();
  }, [id, exercise?.status, getPendingUsers]);

  if (!exercise || !id || !pendingUsers) {
    return <GecoLoader />;
  }

  if (
    (!pendingUsers?.some((pendingUser: PendingUser) => pendingUser.user_id === user?.id) &&
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
      return <TTMSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
    case 'reviewing':
      return <TTMReview />;
    case 'completed':
      return <TTMReview isCompleted={true} />;
  }
}
