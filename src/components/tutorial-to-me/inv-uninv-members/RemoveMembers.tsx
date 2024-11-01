'use client';

import {Button, Header, PageLayout} from '@/components';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {Save} from 'lucide-react';
import {FC} from 'react';

const UninviteMembers: FC = () => {
  const {members, removeMember} = useTutorialToMe();

  const handleRemoveMembersChange = () => {
    console.log('remove members');
  };

  return (
    <PageLayout
      header={<Header />}
      footer={
        <Button variant="green" className="w-fi h-12" onClick={handleRemoveMembersChange}>
          <div className="flex items-center justify-center text-md">
            Submit
            <Save size={24} className="ml-2" />
          </div>
        </Button>
      }>
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
    </PageLayout>
  );
};

export default UninviteMembers;
