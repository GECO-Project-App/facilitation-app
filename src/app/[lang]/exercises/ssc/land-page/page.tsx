import {Button, NavBar} from '@/components';
import {getDictionary} from '../../../dictionaries';
import SscRivLandPage from '@/components/ssc-exercise/rives/SscRivLandPage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ClearLocalStorage from '@/components/ssc-exercise/ClearLocalStorage';

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
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-blue text-white">
      <ClearLocalStorage />
      <NavBar />
      <section>
        <SscRivLandPage />
      </section>
      <section>
      <header>
  <h1 className="text-2xl font-bold mb-2">Start-Stop-Continue Exercise</h1>
  <h2 className="text-xl mb-4">Reflect and Improve</h2>
</header>
        <p>
          The Start, Stop, Continue (SSC) exercise is a feedback technique that helps people and
          teams reflect on what activities they should start, stop, or continue doing.It can be used
          for a variety of purposes, such as,create a framework for feedback, encourage new ideas,
          focus on action and collaboration, and promote broader thinking.
        </p>
      </section>
      <Link href={'/exercises/ssc'}>
          <Button variant="checkin" hasShadow className="mx-auto">
            Start  <ArrowRight size={28} />
          </Button>
        </Link>
    </main>
  );
}
