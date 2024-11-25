import {
  AuthTabs,
  EditTeamDialog,
  Header,
  InviteCodeCard,
  PageLayout,
  TeamGrid,
  TeamSelect,
  TeamTabs,
} from '@/components';
import {getUserTeams} from '@/lib/actions/teamActions';
import {useUserStore} from '@/store/userStore';

export default async function TeamPage() {
  const {teams} = await getUserTeams();

  const user = useUserStore.getState().user;

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
        <section className="flex flex-col gap-6 ">
          <div className="flex justify-center">
            <EditTeamDialog />
          </div>
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
