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
  const {currentTeam, facilitator, isFacilitator, userProfile} = useTeamStore();
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
    <section className="space-y-4">
      {facilitator && (
        <div className=" max-w-xs mx-auto">
          <BaseballCard member={facilitator} open>
            <Button variant="white" size="xs" className=" justify-between w-full">
              Edit Your Profile <ChangeRole />
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
              open={openCards.includes(index) || index === 0}
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
