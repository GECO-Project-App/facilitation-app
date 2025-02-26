'use client';
import {useTeamStore} from '@/store/teamStore';

import {useEffect} from 'react';
import {Tables} from '../../database.types';
import {ProfileAvatar} from './ProfileAvatar';

export const TeamAvatars = ({teamMembers}: {teamMembers?: Array<Tables<'team_members'>> | []}) => {
  const {currentTeam, updateUserTeams} = useTeamStore();

  useEffect(() => {
    updateUserTeams();
  }, [updateUserTeams]);

  return (
    <div className="flex [&>*]:-mr-4 items-center justify-center">
      {teamMembers &&
        teamMembers.slice(0, 4).map((member) => (
          <div key={member.user_id}>
            <ProfileAvatar memberProfile={member} />
          </div>
        ))}
      {teamMembers && teamMembers.length > 4 && (
        <div className="border-2 border-black w-16 h-16 rounded-full flex items-center justify-center bg-white z-10">
          <p className="text-lg">+{teamMembers.length - 4}</p>
        </div>
      )}
    </div>
  );
};
