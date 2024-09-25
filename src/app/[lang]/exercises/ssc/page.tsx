import {Button} from '@/components';
import {Lamp} from '@/components/icons/lamp';
import {Lock} from '@/components/icons/lock';
import CheckBox from '@/components/ssc-exercise/check-box/CheckBox';
import {buttons} from '@/lib/ssc-mock-data';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import {getDictionary} from '../../dictionaries';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function SSCPage({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);
  return (
    <main className="page-padding flex min-h-screen flex-col bg-deepPurple">
      <section className="flex flex-row justify-between">
        <Link href={'/'}>
          <ArrowLeft size={60} />
        </Link>
        <Link href={'/exercises/ssc/tips'} className="self-end">
          <Lamp className="hover:animate-shake fill-white hover:fill-yellow" />
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
            Feedback
          </Link>
        </Button>
      </section>
    </main>
  );
}
