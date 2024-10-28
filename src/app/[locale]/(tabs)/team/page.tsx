import {
  AuthTabs,
  Header,
  InviteCodeCard,
  PageLayout,
  TeamGrid,
  TeamSelect,
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
    <PageLayout
      header={
        teams &&
        teams.length > 0 && (
          <Header showBackButton={false}>
            <TeamSelect teams={teams} />
          </Header>
        )
      }>
      {teams && teams.length > 0 ? (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
            <InviteCodeCard />
            {/* <BaseballCard {...mockTeamMembers[0]} bgColor="bg-yellow" /> */}
          </div>
          <TeamGrid />
        </section>
      ) : (
        <>{user ? <TeamTabs /> : <AuthTabs />}</>
      )}
    </PageLayout>
  );
}
