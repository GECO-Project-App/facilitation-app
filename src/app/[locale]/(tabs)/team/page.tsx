import {BaseballCard, Button, Header, PageLayout} from '@/components';
import {Link} from '@/navigation';

export default function TeamPage() {
  return (
    <PageLayout
      header={
        <Header
          rightContent={
            <Button variant="outline" size="icon" asChild>
              <Link href="/team/manage">Add</Link>
            </Button>
          }
          showBackButton={false}
        />
      }>
      <section className="space-y-4">
        <h3 className="font-bold text-xl">Team</h3>
        <div className="grid gap-2 lg:gap-4 grid-cols-2">
          {Array.from({length: 5}).map((_, index) => (
            <BaseballCard
              key={index}
              name="John Doe"
              role={['Facilitator', 'Member']}
              avatar="https://placehold.co/100x100"
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
