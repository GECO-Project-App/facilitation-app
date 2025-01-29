import {
  EditTeamDialog,
  Header,
  InviteCodeCard,
  PageLayout,
  TeamGrid,
  TeamSelect,
  TeamTabs,
} from '@/components';
import {createClient} from '@/lib/supabase/server';

export default async function TeamPage() {
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  return (
    <PageLayout
      header={
        user && (
          <Header showBackButton={false}>
            <TeamSelect />
          </Header>
        )
      }>
      {user ? (
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
        <TeamTabs />
      )}
    </PageLayout>
  );
}
