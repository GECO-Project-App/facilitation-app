'use client';
import {Link} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {useUserStore} from '@/store/userStore';
import {Pencil} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useMemo} from 'react';
import {Tables} from '../../database.types';
import {ProfileAvatar} from './ProfileAvatar';
import {MemberForm} from './forms';

export const ProfileStats = ({member}: {member: Tables<'team_members'>}) => {
  const {user} = useUserStore();
  const {getTTMExerciseData, ttmData} = useExerciseStore();
  const t = useTranslations();

  const isCurrentUser = useMemo(() => user?.id === member.user_id, [user, member]);

  useEffect(() => {
    getTTMExerciseData(member.user_id);
  }, [member.user_id, getTTMExerciseData]);

  return (
    <section className="h-full flex-1 flex flex-col justify-center gap-6">
      <div className="text-center space-y-1">
        <h3 className=" text-xl font-bold">{`${member.profile_name}`}</h3>
        <p>{t(`common.${member.role}`)}</p>
      </div>
      <div
        className={cn(
          member.role === 'facilitator' ? 'bg-pink' : 'bg-yellow',
          'border-black border-y-2 py-4',
          isCurrentUser && 'border-b-2',
        )}>
        {isCurrentUser ? (
          <Link href={`${member.user_id}/edit`}>
            <div className="relative w-fit mx-auto">
              <ProfileAvatar memberProfile={member} size="lg" />
              <button className="absolute bottom-0 right-0  aspect-square z-10 p-2 border-black border-2 rounded-full  transition-all  bg-white shadow-xs active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none">
                <Pencil size={18} />
              </button>
            </div>
          </Link>
        ) : (
          <ProfileAvatar memberProfile={member} size="lg" />
        )}
      </div>
      <section className="page-constraints flex flex-col gap-6 p-4">
        {isCurrentUser ? (
          <MemberForm user={member} />
        ) : (
          <p className="font-light">{member.description}</p>
        )}

        {ttmData ? (
          <section className="grid grid-cols-1 gap-4  ">
            {Object.keys(ttmData.data).map((stat) => (
              <div key={stat}>
                <h4>{t(`exercises.tutorialToMe.stages.${stat}`)}:</h4>
                <p className="font-light">{ttmData.data[stat].value}</p>
              </div>
            ))}
          </section>
        ) : (
          <h3>{t('common.noStats')}</h3>
        )}
      </section>
    </section>
  );
};
