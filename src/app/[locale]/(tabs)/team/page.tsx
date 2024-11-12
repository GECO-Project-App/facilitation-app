import {
  AuthTabs,
  Button,
  Header,
  InviteCodeCard,
  PageLayout,
  TeamGrid,
  TeamSelect,
  TeamTabs,
} from '@/components';
import {EditTeam} from '@/components/icons';
import {getUserTeams} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/server';

export default async function TeamPage() {
  const supabase = createClient();
  const {teams} = await getUserTeams();
  const {
    data: {user},
    error: AuthError,
  } = await supabase.auth.getUser();

  console.log(teams);
  return (
    <PageLayout
      header={
        teams && (
          <Header
            showBackButton={false}
            rightContent={
              <Button variant="noShadow" size="xs" className="aspect-square">
                <EditTeam />
              </Button>
            }>
            <TeamSelect teams={teams} />
          </Header>
        )
      }>
      {teams ? (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
            <InviteCodeCard />
          </div>
          <TeamGrid />
        </section>
      ) : (
        <>{user ? <TeamTabs /> : <AuthTabs />}</>
      )}
    </PageLayout>
  );
}
