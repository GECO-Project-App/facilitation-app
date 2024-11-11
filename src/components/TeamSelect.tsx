'use client';
import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';
import {useEffect} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui';
export const TeamSelect = ({
  teams,
}: {
  teams: {
    id: string;
    name: string;
  }[];
}) => {
  const {setCurrentTeamId, currentTeam} = useTeamStore();

  useEffect(() => {
    // if (currentTeam) return;
    useTeamStore.getState().init();
  }, []);

  useEffect(() => {
    useExercisesStore.getState().init(currentTeam?.id || '');
  }, [currentTeam?.id]);

  return (
    <Select
      defaultValue={currentTeam?.name ?? teams[0].name}
      value={currentTeam?.id}
      onValueChange={(value) => setCurrentTeamId(value)}>
      <SelectTrigger className="">
        <SelectValue placeholder={currentTeam?.name ?? teams[0].name ?? 'Select a team'} />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
