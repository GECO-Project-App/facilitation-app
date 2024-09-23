import {Button, NavBar, RiveAnimation} from '@/components';
import ClearLocalStorage from '@/components/ssc-exercise/ClearLocalStorage';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';

export default async function Checkin({params}: {params: {locale: string}}) {
  return (
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-blue text-white">
      <ClearLocalStorage />
      <NavBar />
      <section>
        <RiveAnimation src="/assets/riv/ssc_main.riv" />
      </section>
      <section>
        <header>
          <h1 className="mb-2 text-2xl font-bold">Start-Stop-Continue Exercise</h1>
          <h2 className="mb-4 text-xl">Reflect and Improve</h2>
        </header>
        <p>
          The Start, Stop, Continue (SSC) exercise is a feedback technique that helps people and
          teams reflect on what activities they should start, stop, or continue doing.It can be used
          for a variety of purposes, such as,create a framework for feedback, encourage new ideas,
          focus on action and collaboration, and promote broader thinking.
        </p>
      </section>
      <Link href={'/exercises/ssc'}>
        <Button variant="pink" className="mx-auto">
          Start <ArrowRight size={28} />
        </Button>
      </Link>
    </main>
  );
}
