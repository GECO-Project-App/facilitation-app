import {Lamp} from '@/components/icons/lamp';
import {Link} from '@/navigation';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {FC} from 'react';
import {Header} from '../Header';
import {PageLayout} from '../PageLayout';

const Tips: FC = async () => {
  const t = await getTranslations('exercises.ssc.tips');

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      contentColor="bg-yellow"
      header={
        <Header
          leftContent={
            <Link href={'/exercises/ssc'}>
              <ArrowLeft size={42} />
            </Link>
          }>
          <div>
            <h2 className="text-2xl font-bold">{t('title')}</h2>
            <p className="font-light">{t('subtitle')}</p>
          </div>
        </Header>
      }>
      <section className="flex flex-1 flex-col items-center justify-center space-y-8">
        <Lamp className="mx-auto fill-white" width={80} height={80} />

        <div className="space-y-4">
          <h4 className="text-md font-semibold">{t('description')}</h4>
          <ol className="list-decimal pl-8">
            {t.raw('points').map((point: string) => (
              <li key={point} className="font-bold">
                {point}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageLayout>
  );
};

export default Tips;
