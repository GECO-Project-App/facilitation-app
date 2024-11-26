'use client';

import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';
import {useEffect} from 'react';

export default function FetchData() {
  const {currentTeam} = useTeamStore();

  useEffect(() => {
    if (currentTeam) return;
    useTeamStore.getState().init();
  }, [currentTeam]);

  useEffect(() => {
    useExercisesStore.getState().init(currentTeam?.id || '');
  }, [currentTeam?.id]);

  return null;
}
