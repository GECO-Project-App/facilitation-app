import {Link} from '@/i18n/routing';
import {Pencil} from 'lucide-react';
import {Tables} from '../../database.types';
import {ProfileAvatar} from './ProfileAvatar';

export const ProfileStats = ({
  member,
  isCurrentUser,
}: {
  member: Tables<'team_members'>;
  isCurrentUser: boolean;
}) => {
  return (
    <section className="h-full flex-1 flex flex-col justify-center gap-6">
      <div className="text-center space-y-1">
        <h3 className=" text-xl font-bold">{`${member.first_name} ${member.last_name}`}</h3>
        <p>{member.role}</p>
      </div>
      <div className="bg-yellow border-black border-y-2 py-4">
        <Link href={`${member.user_id}/edit`}>
          <div className="relative w-fit mx-auto">
            <ProfileAvatar memberProfile={member} size="lg" />
            {isCurrentUser && (
              <button className="absolute bottom-0 right-0  aspect-square z-10 p-2 border-black border-2 rounded-full  transition-all  bg-white shadow-xs active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none">
                <Pencil size={18} />
              </button>
            )}
          </div>
        </Link>
      </div>

      {/* {isCurrentUser && (

)} */}
      <section className="grid grid-cols-1 gap-4 page-constraints ">
        {['Strength', 'Weakness', 'Communication Style', 'Skills Assessment'].map((stat) => (
          <div key={stat}>
            <h4>{stat}:</h4>
            <p className="font-light">Value</p>
          </div>
        ))}
      </section>
    </section>
  );
};
