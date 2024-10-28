import {
  AuthTabs,
  PageLayout,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TeamTabs,
} from '@/components';
import {getUserTeams} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/server';

export default async function TeamPage() {
  const supabase = createClient();
  const {teams} = await getUserTeams();
  const {
    data: {user},
    error: AuthError,
  } = await supabase.auth.getUser();

  return (
    <PageLayout>
      {teams && teams.length > 0 ? (
        <Select defaultValue={teams[0].name}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.name}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <>{user ? <TeamTabs /> : <AuthTabs />}</>
      )}
    </PageLayout>
  );
}
