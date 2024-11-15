'use client';
import {useRouter} from '@/i18n/routing';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useMemo} from 'react';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const teamValue = useMemo(() => {
    const teamId = searchParams.get('id');
    setCurrentTeamId(teamId);

    return searchParams.get('id') ?? '';
  }, [setCurrentTeamId, searchParams]);

  return (
    <Select
      defaultValue={currentTeam?.name ?? teams[0].name}
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
        <SelectItem value="new">{t('createOrJoin')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
