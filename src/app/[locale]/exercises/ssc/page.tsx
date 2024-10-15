import {Button, Header, PageLayout} from '@/components';
import {Lamp} from '@/components/icons/lamp';
import CheckBox from '@/components/ssc-exercise/check-box/CheckBox';
import {buttons} from '@/lib/ssc-mock-data';
import {Link} from '@/navigation';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function SSCPage() {
  const t = await getTranslations('exercises.ssc');
  const buttonText: string[] = t.raw('buttons').map((btn: string) => btn);

  return (
    <PageLayout
      backgroundColor="bg-deepPurple"
      contentColor="bg-deepPurple"
      header={
        <Header
          leftContent={
            <Link href={'/'}>
              <ArrowLeft size={42} />
            </Link>
          }
          rightContent={
            <Link href={'./exercises/ssc/tips'}>
              <Lamp className="fill-white hover:animate-shake hover:fill-yellow" height={50} />
            </Link>
          }
        />
      }>
      <section className="mx-auto flex max-w-xs flex-1 flex-col items-center justify-center space-y-10">
        {buttons.map((button, i) => (
          <Button
            variant={button.variant}
            className="w-full justify-between"
            asChild
            key={button.title}>
            <Link href={button.href}>
              <CheckBox chapter={button.chapter || ''} />
              <span className="mx-auto">{buttonText[i].toUpperCase()}</span>
            </Link>
          </Button>
        ))}
      </section>
    </PageLayout>
  );
}
