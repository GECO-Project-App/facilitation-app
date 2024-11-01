import {Header, PageLayout} from '@/components';
import {DateAndTimePicker} from '@/components/date-and-time-picker/DateAndTimePicker';
import {getTranslations} from 'next-intl/server';
import CreateButton from '../../CreateButton';

export default async function TutorialToMePage() {
  const t = await getTranslations('exercises.tutorialToMe');
  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={<CreateButton title={t('nextStep')} />}>
      <section className="p-6 space-y-8 flex flex-col justify-evenly items-left h-full">
        <h1 className="text-3xl font-bold">{t('defineTimeline.title')}</h1>
        <p className="mt-4 text-lg">{t('defineTimeline.description')}</p>
        <article className="flex flex-col gap-6">
          <p className="text-2xl font-bold">{t('defineTimeline.writingPhase')}</p>
          <DateAndTimePicker
            btnText={t('defineTimeline.pickADateAndTime')}
            variant="purple"
            mode="writing"
          />
        </article>
        <article className="flex flex-col gap-6">
          <p className="text-2xl font-bold">{t('defineTimeline.reviewingPhase')}</p>
          <DateAndTimePicker
            btnText={t('defineTimeline.pickADateAndTime')}
            variant="blue"
            mode="reviewing"
          />
        </article>
      </section>
    </PageLayout>
  );
}
