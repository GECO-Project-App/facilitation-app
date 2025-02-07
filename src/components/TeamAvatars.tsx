'use client';
import {useTeamStore} from '@/store/teamStore';

import {useState} from 'react';
import {Tables} from '../../database.types';
import {ProfileAvatar} from './ProfileAvatar';

export const TeamAvatars = ({teamMembers}: {teamMembers: Array<Tables<'team_members'>> | []}) => {
  const {currentTeam} = useTeamStore();
  const [team, setTeam] = useState<Array<Tables<'team_members'>> | []>(
    teamMembers ?? currentTeam?.team_members ?? [],
  );
  return (
    <div className="flex [&>*]:-mr-4 items-center justify-center">
      {team &&
        team.slice(0, 4).map((member) => (
          <div key={member.user_id}>
            <ProfileAvatar memberProfile={member} />
          </div>
        ))}
      {team && team.length > 4 && (
        <div className="border-2 border-black w-16 h-16 rounded-full flex items-center justify-center bg-white z-10">
          <p className="text-lg">+{team.length - 4}</p>
        </div>
      )}
    </div>
  );
};
