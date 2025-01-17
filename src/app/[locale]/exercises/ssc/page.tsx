'use client';
import {About, SSCSwipe} from '@/components';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {PendingUsers} from '@/lib/types';
import {useExerciseStore} from '@/store/exerciseStore';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export default function SSCPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {
    exercise,
    getExerciseById,
    getUserExerciseData,
    exerciseData,
    pendingUsers,
    getPendingSubmissions,
  } = useExerciseStore();
  const router = useRouter();

  useEffect(() => {
    if (id && !exercise) {
      getExerciseById(id);
      getPendingSubmissions(id);
    }

    if (id) {
      getUserExerciseData(id);
    }
  }, [id, exercise, getExerciseById, getUserExerciseData, getPendingSubmissions]);

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
        people={pendingUsers.map((user: PendingUsers) => `${user.firstName} ${user.lastName}`)}
      />
    );
  }

  return <SSCSwipe deadline={new Date(exercise.deadline[exercise.status])} />;
}
