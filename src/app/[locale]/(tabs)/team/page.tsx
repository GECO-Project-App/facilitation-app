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
  TeamGrid,
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
              <Link href="/team/">
                <EditTeam />
              </Link>
            </Button>
          </div>
        </Header>
      }>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
          <BaseballCard {...mockTeamMembers[0]} bgColor="bg-yellow" />
          <InviteCodeCard />
        </div>
        <section className="space-y-4 ">
          <h3 className="font-bold text-xl">Team</h3>
          <TeamGrid members={mockTeamMembers} />
        </section>
      </section>
    </PageLayout>
  );
}
