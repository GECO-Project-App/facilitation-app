'use client';
import {useToast} from '@/hooks/useToast';
import {removeTeamMember} from '@/lib/actions/teamActions';
import {useTeamStore} from '@/store/teamStore';
import {FC, useCallback, useState} from 'react';
import {BaseballCard} from './BaseballCard';
import {ChangeRole, RemoveMember} from './icons';
import {Button} from './ui';

export const TeamGrid: FC = () => {
  const [openCards, setOpenCards] = useState([0]);
  const {currentTeam, isFacilitator, userProfile} = useTeamStore();
  const {toast} = useToast();

  const toggleCard = useCallback((index: number) => {
    setOpenCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  const handleRemoveMember = async (userId: string) => {
    if (!currentTeam) return;
    const result = await removeTeamMember(currentTeam.id, userId);

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Team member removed successfully',
      });
    }
  };

  return (
    <section className="space-y-4 ">
      <div className=" max-w-xs mx-auto">
        <BaseballCard member={userProfile} open>
          <Button variant="white" size="xs" className=" justify-between w-full">
            Edit Your Profile <ChangeRole />
          </Button>
        </BaseballCard>
      </div>

      <h3 className="font-bold text-xl text-center">{currentTeam?.name}</h3>

      <div className="grid gap-2 lg:gap-4 grid-cols-2">
        {currentTeam?.team_members?.map((member, index) => (
          <BaseballCard
            key={index}
            member={member}
            onOpenChange={() => toggleCard(index)}
            open={openCards.includes(index)}
            onClick={() => toggleCard(index)}>
            {isFacilitator && (
              <>
                <Button
                  variant="white"
                  size="xs"
                  className=" justify-between w-full "
                  onClick={() => handleRemoveMember(member.user_id)}>
                  Remove
                  <RemoveMember />
                </Button>
                <Button variant="white" size="xs" className=" justify-between w-full">
                  Change role <ChangeRole />
                </Button>
              </>
            )}

            <Button variant="white" size="xs" className=" justify-between w-full">
              See profile <ChangeRole />
            </Button>
          </BaseballCard>
        ))}
      </div>
    </section>
  );
};
