'use client';
import {Button} from '@/components/ui/button/button';
import {Link} from '@/navigation';
import {UserRoundMinus, UserRoundPlus} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
const InvOrDelMember: FC = () => {
  const t = useTranslations('exercises.tutorialToMe');
  return (
    <div className="bg-yellow w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
      <img src="/assets/svg/inv_del_member.svg" alt="Invite or Delete Member" />
      <Button variant="white" className="w-full h-12">
        <Link href={'/exercises/tutorial-to-me/members/invite'}>
          <div className="flex items-center justify-center text-md">
            {t('inviteTeamMember')}
            <UserRoundPlus size={24} className="ml-2" />
          </div>
        </Link>
      </Button>
      <Button variant="white" className="w-full h-12">
        <Link href={'/exercises/tutorial-to-me/members/remove'}>
          <div className="flex items-center justify-center text-md">
            {t('removeTeamMember')}
            <UserRoundMinus size={24} className="ml-2" />
          </div>
        </Link>
      </Button>
    </div>
  );
};

export default InvOrDelMember;
