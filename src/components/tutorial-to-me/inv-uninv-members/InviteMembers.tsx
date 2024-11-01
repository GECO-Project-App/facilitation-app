'use client';
import {Header, PageLayout} from '@/components';
import {Button} from '@/components/ui/button/button';
import {Input} from '@/components/ui/input/input';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {Save} from 'lucide-react';
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
    <PageLayout
      header={<Header />}
      footer={
        <Button variant="green" className="w-fi h-12" onClick={handleInviteMemberChange}>
          <div className="flex items-center justify-center text-md">
            Submit
            <Save size={24} className="ml-2" />
          </div>
        </Button>
      }>
      <section className="text-center p-4">
        <h1 className="text-xl font-bold">Invite Team Members</h1>
        <div className="bg-green w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
          <Input
            placeholder="Enter email address"
            className="w-full bg-white border-black rounded-full"
            value={inviteMember}
            onChange={(e) => setInviteMember(e.target.value)}
          />
        </div>
      </section>
    </PageLayout>
  );
};

export default InviteMembers;
