import {ProfileStats} from '@/components';
import {getTeamMember} from '@/lib/actions/teamActions';

export default async function TeamMemberPage({
  params: {teamId, id},
}: {
  params: {teamId: string; id: string};
}) {
  const {member, error} = await getTeamMember(teamId, id);

  if (!member) return <div>Member not found</div>;

  return <ProfileStats member={member} />;
}
