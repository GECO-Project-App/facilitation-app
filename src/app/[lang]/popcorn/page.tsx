import {Button, NavBar, RandomQuestion} from '@/components';
import {getDictionary} from '../dictionaries';
import {mockPopcorn} from '@/lib/mock';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Checkin({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="flex min-h-screen flex-col justify-between bg-blue">
      <NavBar />
      <section className="flex flex-1 flex-col items-center space-y-16">
        <p className="text-white">Pass it on to someone</p>
        <RandomQuestion items={mockPopcorn} />
      </section>
      <Button>Home</Button>
    </main>
  );
}
