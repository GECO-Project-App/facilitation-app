import {Header, Progress, SwipeFeed} from '@/components';

export default async function ExerciseReviewPage({params}: {params: {slug: string}}) {
  const {slug} = params;

  return (
    <section className="min-h-svh h-full w-full p-8 max-w-lg mx-auto flex flex-col gap-4">
      <div className="hidden lg:block">
        <Header />
      </div>
      <Progress value={50} />
      <main className="flex-1 relative">
        <SwipeFeed />
      </main>
    </section>
  );
}
