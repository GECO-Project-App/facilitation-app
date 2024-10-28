'use client';
import {useTeamStore} from '@/store/teamStore';
import {FC, useCallback, useState} from 'react';
import {BaseballCard} from './BaseballCard';
import {ChangeRole, RemoveMember} from './icons';
import {Button} from './ui';

export const TeamGrid: FC = () => {
  const [openCards, setOpenCards] = useState([0]);
  const {currentTeam} = useTeamStore();

  const toggleCard = useCallback((index: number) => {
    setOpenCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  console.log(currentTeam);

  return (
    <section className="space-y-4 ">
      <h3 className="font-bold text-xl text-center">{currentTeam?.name}</h3>

      <div className="grid gap-2 lg:gap-4 grid-cols-2">
        {currentTeam?.team_members?.map((member, index) => (
          <BaseballCard
            key={index}
            member={member}
            onOpenChange={() => toggleCard(index)}
            open={openCards.includes(index)}
            onClick={() => toggleCard(index)}>
            <Button variant="white" size="xs" className=" justify-between w-full ">
              Remove
              <RemoveMember />
            </Button>
            <Button variant="white" size="xs" className=" justify-between w-full">
              Change role <ChangeRole />
            </Button>
            <Button variant="white" size="xs" className=" justify-between w-full">
              See profile <ChangeRole />
            </Button>
          </BaseballCard>
        ))}
      </div>
    </section>
  );
};
