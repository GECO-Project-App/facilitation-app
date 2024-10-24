'use client';
import {TeamMember} from '@/lib/mock';
import {FC, useCallback, useState} from 'react';
import {BaseballCard} from './BaseballCard';
import {ChangeRole, RemoveMember} from './icons';
import {Button} from './ui/button';

export const TeamGrid: FC<{members: TeamMember[]}> = ({members}) => {
  const [openCards, setOpenCards] = useState([0]);

  const toggleCard = useCallback((index: number) => {
    setOpenCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  return (
    <div className="grid gap-2 lg:gap-4 grid-cols-2">
      {members.map((member, index) => (
        <BaseballCard
          key={index}
          {...member}
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
  );
};
