import {Header, PageLayout} from '@/components';

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
      <h1>Manage</h1>
    </PageLayout>
  );
}
