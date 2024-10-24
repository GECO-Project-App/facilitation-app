'use client';
import {Link} from '@/i18n/routing';
import {TeamMember} from '@/lib/mock';
import {FC, useCallback, useState} from 'react';
import {BaseballCard} from './BaseballCard';
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
          </Button>
          <Button variant="white" size="xs" className=" justify-between w-full">
            Change role
          </Button>
          <Button variant="white" size="xs" className=" justify-between w-full ">
            Edit profile
          </Button>
          <Button variant="yellow" size="xs" className=" justify-between w-full" asChild>
            <Link href={`/team/member/1`}>See profile</Link>
          </Button>
        </BaseballCard>
      ))}
    </div>
  );
};
