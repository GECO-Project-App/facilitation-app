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
    <main className="page-padding flex min-h-screen flex-col" style={{backgroundColor: 'rgb(147 51 234)'}}>
      <section className="flex flex-row justify-evenly">
        <Link href={'/'}>
          <ArrowLeft size={60} />
        </Link>
        <Link href={'/exercises/ssc/tips'} className="self-end">
          <Light />
        </Link>
      </section>
      <section className="flex flex-1 flex-col items-center justify-evenly">
        <Link href={'/exercises/ssc/introduction?chapter=start'}>
          <Button variant="checkout" hasShadow className="mx-auto">
            <CheckBox chapter="start"/>
            START
          </Button>
        </Link>
        <Link href={'/exercises/ssc/introduction?chapter=stop'}>
          <Button variant="stop" hasShadow className="mx-auto">
            <CheckBox chapter="stop"/>
            STOP
          </Button>
        </Link>
        <Link href={'/exercises/ssc/introduction?chapter=continue'}>
          <Button variant="checkin" hasShadow className="mx-auto">
            <CheckBox chapter="continue"/>
            CONTINUE
          </Button>
        </Link>
        <Link href={'/exercises/ssc/feedback'}>
          <Button variant="back" hasShadow className="mx-auto">
            <Lock />
            Feedback
          </Button>
        </Link>
      </section>
    </main>
  );
}
