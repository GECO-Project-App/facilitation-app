'use client';
import {Link} from '@/i18n/routing';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {FC, useCallback, useState} from 'react';
import {BaseballCard} from './BaseballCard';
import {ChangeRole} from './icons';
import {TeamGridButtons} from './TeamGridButtons';
import {TeamTabs} from './TeamTabs';
import {Button} from './ui';

export const TeamGrid: FC = () => {
  const [openCards, setOpenCards] = useState([0]);
  const {currentTeam, facilitator, isFacilitator, userProfile, currentTeamId} = useTeamStore();
  const t = useTranslations('team.page');

  const toggleCard = useCallback((index: number) => {
    setOpenCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  if (!currentTeam) return null;

  return (
    <>
      {currentTeamId === 'new' ? (
        <TeamTabs />
      ) : (
        <section className="space-y-4">
          {facilitator && (
            <div className=" max-w-xs mx-auto">
              <BaseballCard member={facilitator} open>
                <Button variant="white" size="xs" className=" justify-between w-full" asChild>
                  {facilitator.user_id === userProfile?.user_id ? (
                    <Link href={`/team/${currentTeamId}/member/${userProfile.user_id}`}>
                      {t('buttons.editProfile')} <ChangeRole />
                    </Link>
                  ) : (
                    <Link href={`/team/${currentTeamId}/member/${facilitator.user_id}`}>
                      {' '}
                      {t('buttons.showProfile')}
                    </Link>
                  )}
                </Button>
              </BaseballCard>
            </div>
          )}

          <h3 className="font-bold text-xl text-center">{currentTeam?.name}</h3>

          <div className="grid gap-2 lg:gap-4 grid-cols-2">
            {// Filter out the facilitator from the team members
            currentTeam?.team_members
              ?.filter((member) => member.user_id !== facilitator?.user_id)
              .map((member, index) => (
                <BaseballCard
                  key={index}
                  member={member}
                  onOpenChange={() => toggleCard(index)}
                  open={openCards.includes(index)}
                  onClick={() => toggleCard(index)}>
                  <TeamGridButtons {...member} />
                </BaseballCard>
              ))}
          </div>
        </section>
      )}
    </>
  );
};
