'use client';
import {Button} from '@/components/ui/button/button';
import {Input} from '@/components/ui/input/input';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {UserRoundPlus} from 'lucide-react';
import {FC, useState} from 'react';
const InviteMembers: FC = () => {
  const [inviteMember, setInviteMember] = useState('');
  const {addMember} = useTutorialToMe();
  const handleInviteMemberChange = () => {
    console.log(inviteMember);
    if (inviteMember.trim() !== '') {
      addMember({
        nickname: inviteMember,
        id: `id-${inviteMember}-${Math.random().toString(36).substr(2, 9)}`,
        avatar: '',
      });
      setInviteMember('');
    }
  };

  return (
    <section className="text-center p-4">
      <h1 className="text-xl font-bold">Invite Team Members</h1>
      <div className="bg-green w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
        <Input
          placeholder="Enter email address"
          className="w-full bg-white border-black rounded-full"
          value={inviteMember}
          onChange={(e) => setInviteMember(e.target.value)}
        />
        <Button variant="white" className="w-full h-12" onClick={handleInviteMemberChange}>
          <div className="flex items-center justify-center text-md">
            Invite Members
            <UserRoundPlus size={24} className="ml-2" />
          </div>
        </Button>
      </div>
    </section>
  );
};

export default InviteMembers;
