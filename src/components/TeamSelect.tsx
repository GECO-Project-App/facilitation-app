'use client';
import {useTeamStore} from '@/store/teamStore';
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
    useTeamStore.getState().init();
  }, []);

  return (
    <Select
      defaultValue={currentTeam?.name ?? teams[0].name}
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
