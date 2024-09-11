import {Button, NavBar} from '@/components';
import Link from 'next/link';
import {getDictionary} from '../../dictionaries';
import {Light} from '@/components/Light/Light';
import './ssc.css';

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
    <main className="page-padding flex min-h-screen flex-col bg-blue">
      <NavBar />
      <section className="flex flex-1 flex-col items-center justify-evenly">
        <Link href={'/exercises/ssc/tips'} className='self-end pr-[10%]'>
          <Light />
        </Link>
        <Link href={'/exercises/ssc/start'}>
          <Button variant="checkout" hasShadow className="mx-auto" size="circle">
            START
          </Button>
        </Link>
        <Link href={'/exercises/ssc/stop'}>
          <Button variant="stop" hasShadow className="mx-auto" size="circle">
            STOP
          </Button>
        </Link>
        <Link href={'/exercises/ssc/continue'}>
          <Button variant="checkin" hasShadow className="mx-auto" size="circle">
            CONTINUE
          </Button>
        </Link>
        <Link href={'/exercises/ssc/feedback'}>
          <Button variant="back" hasShadow className="mx-auto">
            Feedback
          </Button>
        </Link>
      </section>
    </main>
  );
}
