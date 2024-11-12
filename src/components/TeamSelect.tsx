'use client';
import {useRouter} from '@/i18n/routing';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <Select
      defaultValue={currentTeam?.name ?? teams[0].name}
      value={currentTeam?.id}
      onValueChange={(value) => {
        setCurrentTeamId(value);
        router.push(`/team?${createQueryString('id', value)}`);
      }}>
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
