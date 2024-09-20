import {Button, NavBar} from '@/components';
import Link from 'next/link';
import {getDictionary} from '../../dictionaries';
import {Light} from '@/components/Light/Light';
import './ssc.css';
import {ArrowLeft} from 'lucide-react';
import CheckBox from '@/components/ssc-exercise/check-box/CheckBox';
import {Lock} from '@/components/icons/lock';
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
    <main
      className="page-padding flex min-h-screen flex-col"
      style={{backgroundColor: 'rgb(147 51 234)'}}>
      <section className="flex flex-row justify-evenly">
        <Link href={'/'}>
          <ArrowLeft size={60} />
        </Link>
        <Link href={'/exercises/ssc/tips'} className="self-end">
          <Light />
        </Link>
      </section>
      <section className="mx-auto flex flex-1 flex-col items-center justify-evenly">
        <Button variant="green" className="mx-auto w-full justify-between" asChild>
          <Link href={'/exercises/ssc/introduction?chapter=start'}>
            START
            <CheckBox chapter="start" />
          </Link>
        </Button>
        <Button variant="red" className="mx-auto w-full justify-between" asChild>
          <Link href={'/exercises/ssc/introduction?chapter=stop'}>
            STOP
            <CheckBox chapter="stop" />
          </Link>
        </Button>
        <Button variant="pink" className="mx-auto w-full justify-between" asChild>
          <Link href={'/exercises/ssc/introduction?chapter=continue'}>
            CONTINUE
            <CheckBox chapter="continue" />
          </Link>
        </Button>
        <Button variant="yellow" className="mx-auto" asChild>
          <Link href={'/exercises/ssc/feedback'}>
            <Lock />
            Feedback
          </Link>
        </Button>
      </section>
    </main>
  );
}
