'use client';
import {Link} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';
import {Pencil} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useMemo} from 'react';
import {Tables} from '../../database.types';
import {ProfileAvatar} from './ProfileAvatar';
import {MemberForm} from './forms';

export const ProfileStats = ({member}: {member: Tables<'team_members'>}) => {
  const {user} = useUserStore();
  const t = useTranslations('common');

  const isCurrentUser = useMemo(() => user?.id === member.user_id, [user, member]);
  return (
    <section className="h-full flex-1 flex flex-col justify-center gap-6">
      <div className="text-center space-y-1">
        <h3 className=" text-xl font-bold">{`${member.profile_name}`}</h3>
        <p>{t(member.role)}</p>
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
      <section className="page-constraints flex flex-col gap-6">
        {isCurrentUser ? (
          <MemberForm user={member} />
        ) : (
          <p className="font-light">{member.description}</p>
        )}

        {/* TODO: add a stats section from tutorial to me here */}
        <section className="grid grid-cols-1 gap-4  ">
          {['Strength', 'Weakness', 'Communication Style', 'Skills Assessment'].map((stat) => (
            <div key={stat}>
              <h4>{stat}:</h4>
              <p className="font-light">Value</p>
            </div>
          ))}
        </section>
      </section>
    </section>
  );
};
