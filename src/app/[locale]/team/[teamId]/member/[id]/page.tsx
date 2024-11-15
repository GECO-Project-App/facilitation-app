import {Header, ProfileStats} from '@/components';
import {getTeamMember} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/server';
import {cn} from '@/lib/utils';

export default async function TeamMemberPage({
  params: {teamId, id},
}: {
  params: {teamId: string; id: string};
}) {
  const supabase = createClient();
  const {member, error} = await getTeamMember(teamId, id);
  const {data: user} = await supabase.auth.getUser();

  if (!member) return <div>Member not found</div>;

  return (
    <section
      className={cn(
        user?.user?.id === member.user_id
          ? 'bg-white'
          : member.role === 'facilitator'
            ? 'bg-pink'
            : 'bg-yellow',

        'min-h-svh h-full flex flex-col',
      )}>
      <div className="p-4">
        <Header />
      </div>
      <ProfileStats member={member} isCurrentUser={user?.user?.id === member.user_id} />
    </section>
  );
}
