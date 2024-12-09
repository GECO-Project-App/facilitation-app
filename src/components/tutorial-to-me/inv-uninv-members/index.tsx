'use client';
import {TeamAvatars} from '@/components/TeamAvatars';
import {TeamSelect} from '@/components/TeamSelect';
import {Button} from '@/components/ui/button/button';
import {useDoneTutorialExercise} from '@/hooks/useDoneExercise';
import {Link} from '@/i18n/routing';
import {UserRoundMinus, UserRoundPlus} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
interface InvOrDelMemberProps {
  toturianExerciseId?: string;
}

const InvOrDelMember: FC<InvOrDelMemberProps> = ({toturianExerciseId}) => {
  const t = useTranslations('exercises.tutorialToMe');
  const {done} = useDoneTutorialExercise();

  return (
    <>
      <TeamSelect disableCreateOrJoin />
      <section className="bg-yellow w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
        <TeamAvatars />
        {toturianExerciseId ? (
          <div className="text-center text-lg">
            {!done ? 'There is an exercises to do' : 'You already did this exercise'}
          </div>
        ) : (
          <>
            <Button variant="white" className="w-full h-12">
              <Link href={'/team'}>
                <div className="flex items-center justify-center text-md">
                  {t('inviteTeamMember')}
                  <UserRoundPlus size={24} className="ml-2" />
                </div>
              </Link>
            </Button>
            <Button variant="white" className="w-full h-12">
              <Link href={'/team'}>
                <div className="flex items-center justify-center text-md">
                  {t('removeTeamMember')}
                  <UserRoundMinus size={24} className="ml-2" />
                </div>
              </Link>
            </Button>
          </>
        )}
      </section>
    </>
  );
};

export default InvOrDelMember;
