import {ProfileStats} from '@/components';
import {getTeamMember} from '@/lib/actions/teamActions';
import {notFound} from 'next/navigation';

export default async function TeamMemberPage({
  params: {teamId, id},
}: {
  params: {teamId: string; id: string};
}) {
  const {member, error} = await getTeamMember(teamId, id);

  if (error) {
    notFound();
  }

  return <ProfileStats member={member} />;
}
