import {Button} from '@/components/ui/button';
import {FC} from 'react';
const InvOrDelMember: FC = () => (
  <div className="bg-yellow w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
    <img src="/assets/svg/inv_del_member.svg" alt="Invite or Delete Member" />
    <Button variant="white" className="w-full h-12">
      Invite team member
    </Button>
    <Button variant="white" className="w-full h-12">
      Remove team member
    </Button>
  </div>
);

export default InvOrDelMember;
