import {Header, ProfileStats} from '@/components';
import {getTeamMember} from '@/lib/actions/teamActions';
import {cn} from '@/lib/utils';

export default async function TeamMemberPage({
  params: {teamId, id},
}: {
  params: {teamId: string; id: string};
}) {
  const {member, error} = await getTeamMember(teamId, id);

  if (!member) return <div>Member not found</div>;

  return (
    <section
      className={cn(
        member.role === 'facilitator' ? 'bg-yellow' : 'bg-pink',

        'min-h-svh h-full flex flex-col',
      )}>
      <div className="p-4">
        <Header />
      </div>
      <ProfileStats member={member} />
    </section>
  );
}
