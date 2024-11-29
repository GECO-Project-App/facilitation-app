'use client';
import {Button} from '@/components/ui/button/button';
import {useDoneTutorialExercise} from '@/hooks/useDoneExercise';
import {Link} from '@/i18n/routing';
import {getUserTeams} from '@/lib/actions/teamActions';
import {Team} from '@/lib/types';
import {UserRoundMinus, UserRoundPlus} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {FC, useEffect, useState} from 'react';
import CurrentAvatars from '../CurrentAvatars';
import SelectTutorialTeam from '../SelectTutorialTeam';
interface InvOrDelMemberProps {
  toturianExerciseId?: string;
}

const InvOrDelMember: FC<InvOrDelMemberProps> = ({toturianExerciseId}) => {
  const t = useTranslations('exercises.tutorialToMe');
  const {done} = useDoneTutorialExercise();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function getTeams() {
      const {teams} = await getUserTeams();
      setTeams(teams || []);
    }
    getTeams();
  }, []);

  return (
    <>
      {teams && teams.length > 0 && (
        <SelectTutorialTeam selectedTeam={teams} disableCreateOrJoin={true} />
      )}
      <section className="bg-yellow w-[80%] h-24 rounded-3xl border-2 border-black p-4 mx-auto flex flex-col gap-4 h-full">
        <CurrentAvatars />
        {/* <Image
          src="/assets/svg/inv_del_member.svg"
          alt="Invite or Delete Member"
          width={220}
          height={68}
          className="mx-auto"
        /> */}
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
