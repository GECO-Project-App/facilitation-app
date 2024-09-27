import {Button} from '@/components';
import CheckBox from '@/components/ssc-exercise/check-box/CheckBox';
import {buttons} from '@/lib/ssc-mock-data';
import {Link} from '@/navigation';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Lamp} from '@/components/icons/lamp';

export default async function SSCPage() {
  const t = await getTranslations('exercises.ssc');
  const buttonText: string[] = t.raw('buttons').map((btn: string) => btn);

  return (
    <main className="page-padding flex min-h-screen flex-col bg-deepPurple">
      <section className="flex flex-row justify-between">
        <Link href={'/'}>
          <ArrowLeft size={60} />
        </Link>
        <Link href={'/exercises/ssc/tips'} className="self-end">
          <Lamp className="fill-white hover:animate-shake hover:fill-yellow" />
        </Link>
      </section>
      <section className="mx-auto flex flex-1 flex-col items-center justify-center space-y-10">
        {buttons.map((button, i) => (
          <Button
            variant={button.variant}
            className="w-full justify-between"
            asChild
            key={button.title}>
            <Link href={button.href}>
              <CheckBox chapter={buttonText[i].toLowerCase()} />
              <span className="mx-auto">{buttonText[i].toUpperCase()}</span>
            </Link>
          </Button>
        ))}
      </section>
    </main>
  );
}
