import {
  Button,
  Header,
  PageLayout,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import {BaseballCardManage} from '@/components/BaseballCardManage';
import {Trash} from 'lucide-react';

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
    <PageLayout header={<Header />}>
      <section className="space-y-6 text-center flex flex-col items-center justify-center">
        <Select defaultValue={teams[0].name}>
          <SelectTrigger>
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
        <section className="flex justify-between">
          <BaseballCardManage name="John Doe" role={['Facilitator', 'Member']}>
            <Button variant="white" size="xs" className="w-full justify-between">
              Edit profile
              <Trash className="w-4 h-4" />
            </Button>
          </BaseballCardManage>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-xl">Manage your team</h3>
          <div className="grid gap-2 lg:gap-4 grid-cols-2 ">
            {Array.from({length: 5}).map((_, index) => (
              <BaseballCardManage
                key={index}
                name="John Doe"
                role={['Facilitator', 'Member']}
                bgColor="bg-pink">
                <Button variant="white" size="xs" className="w-full justify-between ">
                  Remove <Trash className="w-4 h-4" />
                </Button>
                <Button variant="white" size="xs" className="w-full justify-between">
                  Change role <Trash className="w-4 h-4" />
                </Button>
              </BaseballCardManage>
            ))}
          </div>
        </section>
      </section>
    </PageLayout>
  );
}
