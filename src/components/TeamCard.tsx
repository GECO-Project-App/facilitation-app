'use client';
import {useTeamStore} from '@/store/teamStore';
import {RemoveMember} from './icons';
import {TeamAvatars} from './TeamAvatars';
import {Button} from './ui';

export const TeamCard = () => {
  const {currentTeam} = useTeamStore();

  return (
    <div className="md:w-[80%] mx-auto">
      {currentTeam ? (
        <div className="bg-green rounded-3xl border-2 border-black p-4  flex flex-col gap-4 h-full">
          <TeamAvatars />
          <Button variant="white" size="xs" className=" justify-between w-full">
            Test
            <RemoveMember />
          </Button>
        </div>
      ) : (
        <div className="bg-yellow  rounded-3xl border-2 border-black p-4 flex flex-col gap-4 h-full">
          <TeamAvatars />
          <Button variant="white" size="xs" className=" justify-between w-full">
            Test
            <RemoveMember />
          </Button>
          <Button variant="white" size="xs" className=" justify-between w-full">
            Test
            <RemoveMember />
          </Button>
        </div>
      )}
    </div>
  );
};
