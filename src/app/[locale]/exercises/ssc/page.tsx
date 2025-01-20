'use client';
import {About, SSCSwipe} from '@/components';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {ExerciseStatus} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useCallback, useEffect} from 'react';

export default function SSCPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status') as ExerciseStatus;
  const {
    exercise,
    getExerciseById,
    getUserExerciseData,
    exerciseData,
    pendingUsers,
    getPendingUsers,
  } = useExerciseStore();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
    }
    if (id) {
      getUserExerciseData(id);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData]);

  useCallback(() => {
    if (id && status) {
      getPendingUsers(id, status);
    }
  }, [id, status, getPendingUsers]);

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
  if (pendingUsers) {
    return (
      <WaitingFor
        deadline={new Date(exercise.deadline[exercise.status])}
        text={t(`common.waitingStatus.${status}`)}
      />
    );
  }

  return <SSCSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
}
