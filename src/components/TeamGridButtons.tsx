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
  const t = useTranslations('team.page');
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
        title: t('removeMemberSuccess'),
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="white" size="xs" className=" justify-between w-full" asChild>
        {member.user_id === userProfile?.user_id ? (
          <Link href={`/team/${currentTeamId}/member/${userProfile.user_id}`}>
            {t('buttons.editProfile')} <ChangeRole />
          </Link>
        ) : (
          <Link href={`/team/${currentTeamId}/member/${member.user_id}`}>
            {t('buttons.showProfile')}
          </Link>
        )}
      </Button>
      {isFacilitator && userProfile?.user_id !== member.user_id && (
        <>
          <TeamActionAlert
            onAction={() => handleRemoveMember(member.user_id)}
            title={t('removeMemberConfirmation')}
            description={t('removeMemberDescription')}>
            <Button variant="white" size="xs" className=" justify-between w-full">
              {t('buttons.remove')}
              <RemoveMember />
            </Button>
          </TeamActionAlert>
          <Button variant="white" size="xs" className=" justify-between w-full">
            {t('buttons.changeRole')} <ChangeRole />
          </Button>
        </>
      )}
    </div>
  );
};
