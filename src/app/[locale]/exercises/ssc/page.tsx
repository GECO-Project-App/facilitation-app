import {Button, NavBar} from '@/components';
import {Light} from '@/components/Light/Light';
import './ssc.css';
import {ArrowLeft} from 'lucide-react';
import CheckBox from '@/components/ssc-exercise/check-box/CheckBox';
import {Lock} from '@/components/icons/lock';
import {buttons} from '@/lib/ssc-mock-data';
import {Link} from '@/navigation';
import {getTranslations} from 'next-intl/server';

export default async function SSCPage({params}: {params: {lang: string}}) {
  const t = await getTranslations('exercises.ssc');
  return (
    <main
      className="page-padding flex min-h-screen flex-col"
      style={{backgroundColor: 'rgb(147 51 234)'}}>
      <section className="flex flex-row justify-between">
        <Link href={'/'}>
          <ArrowLeft size={60} />
        </Link>
        <Link href={'/exercises/ssc/tips'} className="self-end">
          <Light />
        </Link>
      </section>
      <section className="mx-auto flex flex-1 flex-col items-center justify-evenly">
        {buttons.map((button) => (
          <Button
            variant={button.variant}
            className="mx-10 w-full justify-between"
            asChild
            key={button.title}>
            <Link href={button.href}>
              <CheckBox chapter={button.title.toLowerCase()} />
              <span className="mx-auto">{button.title}</span>
            </Link>
          </Button>
        ))}
        <Button variant="yellow" className="mx-auto" asChild>
          <Link href={'/exercises/ssc/feedback'}>
            <Lock />
            {t('feedback')}
          </Link>
        </Button>
      </section>
    </main>
  );
}
