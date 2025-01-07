'use client';
import {useTeamStore} from '@/store/teamStore';

import {ProfileAvatar} from './ProfileAvatar';

export const TeamAvatars = () => {
  const {currentTeam} = useTeamStore();

  return (
    <div className="flex [&>*]:-mr-4 items-center justify-center">
      {currentTeam?.team_members &&
        currentTeam.team_members.slice(0, 4).map((member) => (
          <div key={member.user_id}>
            <ProfileAvatar memberProfile={member} />
          </div>
        ))}
      {currentTeam?.team_members && currentTeam.team_members.length > 4 && (
        <div className="border-2 border-black w-16 h-16 rounded-full flex items-center justify-center bg-white z-10">
          <p className="text-lg">+{currentTeam.team_members.length - 4}</p>
        </div>
      )}
    </div>
  );
};
