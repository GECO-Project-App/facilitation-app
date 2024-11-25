import {Header, ProfileStats} from '@/components';
import {getTeamMember} from '@/lib/actions/teamActions';
import {cn} from '@/lib/utils';
import {useUserStore} from '@/store/userStore';

export default async function TeamMemberPage({
  params: {teamId, id},
}: {
  params: {teamId: string; id: string};
}) {
  const {member, error} = await getTeamMember(teamId, id);
  const user = useUserStore.getState().user;

  if (!member) return <div>Member not found</div>;

  return (
    <section
      className={cn(
        user?.id === member.user_id
          ? 'bg-white'
          : member.role === 'facilitator'
            ? 'bg-yellow'
            : 'bg-pink',

        'min-h-svh h-full flex flex-col',
      )}>
      <div className="p-4">
        <Header />
      </div>
      <ProfileStats member={member} isCurrentUser={user?.id === member.user_id} />
    </section>
  );
}
