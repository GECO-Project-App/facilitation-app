import {NavBar, RandomQuestion} from '@/components';
import {Colors} from '@/lib/constants';
import {mockPopcorn} from '@/lib/mock';
import {getDictionary} from '../../dictionaries';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Popcorn({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="page-padding flex min-h-screen flex-col justify-between bg-blue">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto w-fit space-y-16">
          <p className="text-center text-white">Pass it on to someone</p>
          <RandomQuestion items={mockPopcorn} defaultColor={Colors.Yellow} />
        </div>
      </section>
    </main>
  );
}
