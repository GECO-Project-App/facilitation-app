'use client';
import {cn} from '@/lib/utils';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {FC, useCallback, useState} from 'react';
import {BaseballCard} from './BaseballCard';
import {TeamGridButtons} from './TeamGridButtons';
import {TeamTabs} from './TeamTabs';

export const TeamGrid: FC = () => {
  const [openCards, setOpenCards] = useState([0]);
  const {currentTeam, facilitator, isFacilitator, userProfile, currentTeamId} = useTeamStore();
  const t = useTranslations('team.page');

  const facilitators = currentTeam?.team_members?.filter((member) => member.role === 'facilitator');
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
          <div className="grid gap-2 lg:gap-4 grid-cols-2 ">
            {facilitators &&
              facilitators?.map((member, index) => (
                <div
                  key={index}
                  className={cn(
                    facilitators.length > 1 ? '' : 'col-span-2 max-w-xs mx-auto w-full',
                  )}>
                  <BaseballCard
                    member={member}
                    onOpenChange={() => toggleCard(index)}
                    open={openCards.includes(index) || facilitator?.user_id == member.user_id}
                    onClick={() => toggleCard(index)}>
                    <TeamGridButtons {...member} />
                  </BaseballCard>
                </div>
              ))}

            <h3 className="font-bold text-xl text-center col-span-2">{currentTeam?.name}</h3>
            {// Filter out the facilitator from the team members
            currentTeam?.team_members
              ?.filter((member) => member.role !== 'facilitator')
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
