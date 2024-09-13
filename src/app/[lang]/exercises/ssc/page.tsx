import {Button, NavBar} from '@/components';
import Link from 'next/link';
import {getDictionary} from '../../dictionaries';
import {Light} from '@/components/Light/Light';
import './ssc.css';
import {ArrowLeft} from 'lucide-react';
import {Checked} from '@/components/icons/checked';

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
      <section className="flex flex-row justify-between">
        <Link href={'/'}>
          <ArrowLeft size={60} />
        </Link>
        <Link href={'/exercises/ssc/tips'} className="self-end pr-[10%]">
          <Light />
        </Link>
      </section>
      <section className="flex flex-1 flex-col items-center justify-evenly">
        <Link href={'/exercises/ssc/introduction?step=start'}>
          <Button variant="checkout" hasShadow className="mx-auto">
            <div className="mr-4 h-10 w-10 rounded-full border-2 border-black bg-white">
              <div className="ml-1 -mt-1">
                <Checked />
              </div>
            </div>
            START
          </Button>
        </Link>
        <Link href={'/exercises/ssc/introduction?step=stop'}>
          <Button variant="stop" hasShadow className="mx-auto">
            <div className="mr-4 flex h-10 w-10 flex-row items-center gap-2 rounded-full border-2 border-black bg-white">
              {/* <Checked /> */}
            </div>
            STOP
          </Button>
        </Link>
        <Link href={'/exercises/ssc/introduction?step=continue'}>
          <Button variant="checkin" hasShadow className="mx-auto">
          <div className="mr-4 flex h-10 w-10 flex-row items-center gap-2 rounded-full border-2 border-black bg-white">
          {/* <Checked /> */}
            </div>
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
