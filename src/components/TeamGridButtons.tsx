'use client';

import {useToast} from '@/hooks/useToast';
import {Link} from '@/i18n/routing';
import {removeTeamMember} from '@/lib/actions/teamActions';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {Tables} from '../../database.types';
import {ChangeRole, RemoveMember} from './icons';
import {TeamActionAlert} from './TeamActionAlert';
import {Button} from './ui';

export const TeamGridButtons = (member: Omit<Tables<'team_members'>, 'joined_at' | 'team_id'>) => {
  const t = useTranslations();

  const {currentTeam, facilitator, isFacilitator, userProfile, currentTeamId} = useTeamStore();
  const {toast} = useToast();

  const handleRemoveMember = async (userId: string) => {
    if (!currentTeam) return;
    const result = await removeTeamMember(currentTeam.id, userId);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      toast({
        variant: 'success',
        title: t('team.page.removeMemberSuccess'),
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!currentTeam) return;
    // const result = await changeTeamMemberRole(currentTeam.id, userId, 'facilitator');
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="white" size="xs" className=" justify-between w-full" asChild>
        {member.user_id === userProfile?.user_id ? (
          <Link href={`/team/${currentTeamId}/member/${userProfile.user_id}`}>
            {t('team.page.buttons.editProfile')} <ChangeRole />
          </Link>
        ) : (
          <Link href={`/team/${currentTeamId}/member/${member.user_id}`}>
            {t('team.page.buttons.showProfile')}
          </Link>
        )}
      </Button>
      {isFacilitator && userProfile?.user_id !== member.user_id && (
        <>
          <TeamActionAlert
            onAction={() => handleRemoveMember(member.user_id)}
            title={t('team.page.removeMemberConfirmation', {
              name: `${member.first_name} ${member.last_name}`,
            })}
            description={t('team.page.removeMemberDescription')}>
            <Button variant="white" size="xs" className=" justify-between w-full">
              {t('team.page.buttons.remove')}
              <RemoveMember />
            </Button>
          </TeamActionAlert>
          <TeamActionAlert
            onAction={() =>
              handleChangeRole(member.user_id, member.role === 'member' ? 'facilitator' : 'member')
            }
            title={t('team.edit.role', {
              name: `${member.first_name} ${member.last_name}`,
              role: t(`common.${member.role}`),
              newRole: member.role === 'member' ? t('common.facilitator') : t('common.member'),
            })}>
            <Button variant="white" size="xs" className=" justify-between w-full">
              {t('team.page.buttons.changeRole')} <ChangeRole />
            </Button>
          </TeamActionAlert>
        </>
      )}
    </div>
  );
};
