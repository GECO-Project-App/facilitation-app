import {BaseballCard, Button, Header, PageLayout} from '@/components';
import {EditTeam} from '@/components/icons';
import {mockTeamMembers} from '@/lib/mock';
import {Link} from '@/navigation';

export default function TeamPage() {
  return (
    <PageLayout
      header={
        <Header
          rightContent={
            <Button variant="outline" size="icon" asChild>
              <Link href="/team/manage">
                <EditTeam />
              </Link>
            </Button>
          }
          showBackButton={false}
        />
      }>
      <section className="space-y-4">
        <h3 className="font-bold text-xl text-center">Team</h3>
        <div className="grid gap-2 lg:gap-4 grid-cols-2">
          {mockTeamMembers.map((member, index) => (
            <BaseballCard key={index} {...member}>
              <Button variant="white" size="xs" className=" justify-between w-full ">
                Remove
              </Button>
              <Button variant="white" size="xs" className=" justify-between w-full">
                Change role
              </Button>
              <Button variant="white" size="xs" className=" justify-between w-full ">
                Edit profile
              </Button>
              <Button variant="yellow" size="xs" className=" justify-between w-full" asChild>
                <Link href={`/team/member/1`}>See profile</Link>
              </Button>
            </BaseballCard>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
