'use client';
import {useRouter} from '@/i18n/routing';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui';

export const TeamSelect = ({
  disableCreateOrJoin,
  className,
}: {
  disableCreateOrJoin?: boolean;
  className?: string;
}) => {
  const {setCurrentTeamId, currentTeam, userTeams, updateUserTeams} = useTeamStore();
  const t = useTranslations('team.page');
  const router = useRouter();
  const [teamValue, setTeamValue] = useState<string>('new');

  useEffect(() => {
    const updateTeams = async () => {
      const teams = await updateUserTeams();

      if (teams && teams.length > 0) {
        setCurrentTeamId(teams[0].id);
        setTeamValue(teams[0].id);
        router.push(`?teamId=${teams[0].id}`);
      } else {
        router.push(`?teamId=new`);
      }
    };

    updateTeams();
  }, [setCurrentTeamId, router, updateUserTeams]);

  if (!currentTeam) return null;

  return (
    <Select
      defaultValue={teamValue}
      value={teamValue}
      onValueChange={(value) => {
        setTeamValue(value);
        setCurrentTeamId(value);
        router.push(`?teamId=${value}`);
      }}>
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
