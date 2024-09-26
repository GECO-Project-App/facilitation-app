import React from 'react';
import {ArrowLeft} from 'lucide-react';
import {Lamp} from '@/components/icons/lamp';
import {Link} from '@/navigation';
import {getTranslations} from 'next-intl/server';

const Tips: React.FC = async () => {
  const t = await getTranslations('exercises.ssc.tips');
  const points = t.raw('points').map((point: string) => point);

  return (
    <main className="page-padding flex min-h-screen flex-col bg-yellow">
      <section className="flex flex-1 flex-col items-center justify-evenly text-black">
        <div className="flex w-full flex-row items-center justify-between">
          <Link href={'/exercises/ssc'}>
            <ArrowLeft size={42} />
          </Link>
          <div className="text-xl font-bold">
            <h2>{t('title')}</h2>
          </div>
          <Lamp />
        </div>
        <h4 className="text-md font-semibold">{t('subtitle')}</h4>
        <ol className="list-decimal pl-8">
          {t.raw('points').map((point: string) => (
            <li key={point} className="font-bold">
              {point}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
};

export default Tips;
