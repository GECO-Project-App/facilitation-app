import {Link} from '@/i18n/routing';
import {Tables} from '../../database.types';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {ProfileAvatar} from './ProfileAvatar';

export const ProfileStats = ({member}: {member: Tables<'team_members'>}) => {
  return (
    <PageLayout header={<Header />} backgroundColor="bg-pink" contentColor="bg-pink">
      <div className="text-center space-y-1">
        <h3 className=" text-xl font-bold">{`${member.first_name} ${member.last_name}`}</h3>
        <p>{member.role}</p>
      </div>
      <Link href={`${member.user_id}/edit`}>
        <ProfileAvatar memberProfile={member} size="lg" />
      </Link>
      <section className="grid grid-cols-1 gap-4">
        {
          /* stats */

          ['Strength', 'Weakness', 'Communication Style', 'Skills Assessment'].map((stat) => (
            <div key={stat}>
              <h4>{stat}:</h4>
              <p className="font-light">Value</p>
            </div>
          ))
        }
      </section>
    </PageLayout>
  );
};
