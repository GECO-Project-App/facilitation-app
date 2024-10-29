'use client';
import {useTeamMembers} from '@/store/useTeamMembers';
import {FC} from 'react';

const UninviteMembers: FC = () => {
  const {members, removeMember} = useTeamMembers();
  return (
    <div className="flex flex-col gap-4 p-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="bg-green w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full text-white">
          {member.nickname}
          <span className="text-red-500 cursor-pointer" onClick={() => removeMember(member.id)}>
            Remove
          </span>
        </div>
      ))}
    </div>
  );
};

export default UninviteMembers;
