'use client';
import {useRouter} from '@/i18n/routing';
import {useTeamStore} from '@/store/teamStore';
import {useExercisesStore} from '@/store/useExercises';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect, useMemo} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui';

interface TeamSelectProps {
  teams: {
    id: string;
    name: string;
  }[];
  disableCreateOrJoin?: boolean;
}

export const TeamSelect = ({teams, disableCreateOrJoin}: TeamSelectProps) => {
  const {setCurrentTeamId, currentTeam, currentTeamId} = useTeamStore();
  const t = useTranslations('team.page');
  const router = useRouter();
  const searchParams = useSearchParams();

  const teamValue = useMemo(() => {
    const teamId = searchParams.get('id');
    return teamId ?? teams[0].id;
  }, [searchParams, teams]);

  useEffect(() => {
    if (teamValue) {
      setCurrentTeamId(teamValue);
    }
  }, [setCurrentTeamId, teamValue]);

  useEffect(() => {
    if (!currentTeamId) return;
    useExercisesStore.getState().init(currentTeamId);
  }, [currentTeamId]);
  return (
    <Select
      defaultValue={currentTeam?.id ?? teams[0].id}
      value={teamValue}
      onValueChange={(value) => router.push(`?id=${value}`)}>
      <SelectTrigger className="">
        <SelectValue placeholder={currentTeam?.name ?? teams[0].name ?? 'Select a team'} />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
        <>{!disableCreateOrJoin && <SelectItem value="new">{t('createOrJoin')}</SelectItem>}</>
      </SelectContent>
    </Select>
  );
};
