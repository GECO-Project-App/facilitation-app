'use client';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useCallback} from 'react';
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
  const t = useTranslations('team.page');

  useCallback(() => {
    console.log('effect');

    const init = async () => {
      await useTeamStore.getState().init();
    };
    init();
  }, []);

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
        <SelectItem value="new">{t('createOrJoin')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
