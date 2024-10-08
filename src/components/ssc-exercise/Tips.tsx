import {Lamp} from '@/components/icons/lamp';
import {getTranslations} from 'next-intl/server';
import {FC} from 'react';
import Markdown from 'react-markdown';
import {Header} from '../Header';
import {PageLayout} from '../PageLayout';

const Tips: FC = async () => {
  const t = await getTranslations('exercises.ssc.tips');
  const markdownContent = {
    points:
      '1. Sätt tydliga förväntningar\n2. Tillhandahåll visuellt stöd\n3. Håll dig på rätt spår\n4. Anteckna svar\n5. Analysera feedback och skapa en handlingsplan',
  };

  return (
    <PageLayout
      backgroundColor="bg-yellow"
      contentColor="bg-yellow"
      header={
        <Header>
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
          <Markdown>{markdownContent.points}</Markdown>
          {/* <ol className="list-decimal pl-8">
            {t.rich('points').map((point: string) => (
              <li key={point} className="font-bold">
                {point}
              </li>
            ))}
          </ol> */}
        </div>
      </section>
    </PageLayout>
  );
};

export default Tips;
