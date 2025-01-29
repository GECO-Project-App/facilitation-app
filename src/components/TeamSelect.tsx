'use client';
import {useRouter} from '@/i18n/routing';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect, useMemo} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui';

export const TeamSelect = ({
  disableCreateOrJoin,
  className,
}: {
  disableCreateOrJoin?: boolean;
  className?: string;
}) => {
  const {setCurrentTeamId, currentTeam, currentTeamId, userTeams} = useTeamStore();
  const t = useTranslations('team.page');
  const router = useRouter();
  const searchParams = useSearchParams();

  const teamValue = useMemo(() => {
    const teamId = searchParams.get('teamId');
    if (!teamId) {
      return;
    }

    return teamId ?? userTeams[0].id;
  }, [searchParams, userTeams]);

  useEffect(() => {
    if (teamValue) {
      setCurrentTeamId(teamValue);
    } else {
      if (userTeams.length > 0) {
        router.push(`?teamId=${userTeams[0].id ?? 'new'}`);
      } else {
        router.push(`?teamId=new`);
      }
    }
  }, [setCurrentTeamId, teamValue, router, currentTeamId, userTeams]);

  if (!currentTeam) return null;

  return (
    <Select
      defaultValue={currentTeam?.id ?? ''}
      value={teamValue}
      onValueChange={(value) => router.push(`?teamId=${value}`)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={currentTeam?.name ?? 'Select a team'} />
      </SelectTrigger>
      <SelectContent>
        {userTeams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
        <>{!disableCreateOrJoin && <SelectItem value="new">{t('createOrJoin')}</SelectItem>}</>
      </SelectContent>
    </Select>
  );
};
