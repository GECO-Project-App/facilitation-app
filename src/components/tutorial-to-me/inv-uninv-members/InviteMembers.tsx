import {Button} from '@/components/ui/button/button';
import {UserRoundPlus} from 'lucide-react';
import {FC} from 'react';

const InviteMembers: FC = () => {
  return (
    <div className="bg-green w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
      <img src="/assets/svg/invite_member.svg" alt="Invite Member" />
      <Button variant="white" className="w-full h-12">
        <div className="flex items-center justify-center text-md">
          Invite Members
          <UserRoundPlus size={24} className="ml-2" />
        </div>
      </Button>
    </div>
  );
};

export default InviteMembers;
