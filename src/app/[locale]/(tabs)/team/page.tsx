import {PageLayout, TeamTabs} from '@/components';
import {getUserTeams} from '@/lib/actions/teamActions';

export default async function TeamPage() {
  const {teams} = await getUserTeams();

  return (
    <PageLayout>
      {teams && teams.length > 0 ? (
        <>
          <ul>
            {teams.map((team) => (
              <li key={team.id}>{team.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <TeamTabs />
      )}
    </PageLayout>
  );
}
