import {
  BaseballCard,
  Button,
  Header,
  InviteCodeCard,
  PageLayout,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import {EditTeam} from '@/components/icons';
import {mockTeamMembers} from '@/lib/mock';
import {Link} from '@/navigation';

const teams = [
  {
    name: 'Team 1',
    id: '1',
  },
  {
    name: 'Team 2',
    id: '2',
  },
];
export default function TeamPage() {
  return (
    <PageLayout
      header={
        <Header showBackButton={false}>
          <div className="flex gap-2 items-center w-full">
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
            <Button variant="outline" size="icon" asChild className="aspect-square">
              <Link href="/team/manage">
                <EditTeam />
              </Link>
            </Button>
          </div>
        </Header>
      }>
      <InviteCodeCard />
      <section className="space-y-4">
        <h3 className="font-bold text-xl">Team</h3>
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
