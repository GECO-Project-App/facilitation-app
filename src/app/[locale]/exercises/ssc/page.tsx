import {Button, NavBar} from '@/components';
import Link from 'next/link';
import {Light} from '@/components/Light/Light';
import './ssc.css';
import {ArrowLeft} from 'lucide-react';
import CheckBox from '@/components/ssc-exercise/check-box/CheckBox';
import {Lock} from '@/components/icons/lock';

export default async function Checkin({params}: {params: {locale: string}}) {
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
      <section className="flex flex-1 flex-col items-center justify-evenly">
        <Button variant="green" className="mx-auto" asChild>
          <Link href={'/exercises/ssc/introduction?chapter=start'}>
            <CheckBox chapter="start" />
            START
          </Link>
        </Button>
        <Button variant="red" className="mx-auto" asChild>
          <Link href={'/exercises/ssc/introduction?chapter=stop'}>
            <CheckBox chapter="stop" />
            STOP
          </Link>
        </Button>
        <Button variant="pink" className="mx-auto" asChild>
          <Link href={'/exercises/ssc/introduction?chapter=continue'}>
            <CheckBox chapter="continue" />
            CONTINUE
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
