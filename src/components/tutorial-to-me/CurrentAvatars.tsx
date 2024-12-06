'use client';
import {useTeamStore} from '@/store/teamStore';

import {ProfileAvatar} from '../ProfileAvatar';

const CurrentAvatars = () => {
  const {currentTeam} = useTeamStore();

  return (
    <div className="flex relative overflow-hidden overflow-x-auto">
      {currentTeam?.team_members &&
        currentTeam?.team_members.map((member, index) => (
          <div
            key={index}
            className={`w-24 h-24 bg-blue-${500 - index * 100} relative -mr-5`}
            style={{
              top: `-${index * 20}%`,
              zIndex: 10 - index,
            }}>
            <ProfileAvatar memberProfile={member} key={index} />
          </div>
        ))}
    </div>
  );
};

export default CurrentAvatars;
