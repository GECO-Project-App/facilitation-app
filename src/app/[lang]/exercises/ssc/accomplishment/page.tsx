import {Button, NavBar, RandomQuestion} from '@/components';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {getDictionary} from '../../../dictionaries';
import AccomplishmentRiv from '@/components/ssc-exercise/rives/AccomplishmentRiv';
export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Accomplishment({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="page-padding flex min-h-screen flex-col bg-blue">
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto w-fit text-center text-white">
          <div className="mb-12">
            <h1 className="text-4xl font-bold">GREAT JOB!</h1>
            <h2 className="text-xl font-bold">YOU DID IT! GRATTIS!</h2>
          </div>
          <div className="flex flex-col items-center space-y-12">
            <div className="m-2 mx-auto rounded-full bg-pink p-2">
              <AccomplishmentRiv />
            </div>
            <Link href={'/exercises/ssc/'}>
              <Button variant="red" className="mx-auto">
                Go to home<ArrowRight size={28} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
