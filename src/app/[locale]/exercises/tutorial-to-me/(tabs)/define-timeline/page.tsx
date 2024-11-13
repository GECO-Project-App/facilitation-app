import {Header, PageLayout} from '@/components';
import {DateAndTimePicker} from '@/components/date-and-time-picker/DateAndTimePicker';
import {Button} from '@/components/ui/button/button';
import {Link} from '@/i18n/routing';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
export default async function TutorialToMePage() {
  const t = await getTranslations('exercises.tutorialToMe');
  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={
        <Button variant="blue" asChild className="mx-auto">
          <Link href={`/exercises/tutorial-to-me`}>
            {t('nextStep')} <ArrowRight size={28} />
          </Link>
        </Button>
      }>
      <section className="p-6 space-y-8 flex flex-col justify-evenly items-left h-full">
        <h1 className="text-3xl font-bold">{t('defineTimeline.title')}</h1>
        <p className="mt-4 text-lg">{t('defineTimeline.description')}</p>
        <article className="flex flex-col gap-6">
          <p className="text-2xl font-bold">{t('defineTimeline.writingPhase')}</p>
          <DateAndTimePicker btnText={t('defineTimeline.pickADateAndTime')} variant="purple" />
        </article>
        <article className="flex flex-col gap-6">
          <p className="text-2xl font-bold">{t('defineTimeline.reviewingPhase')}</p>
          <DateAndTimePicker btnText={t('defineTimeline.pickADateAndTime')} variant="blue" />
        </article>
      </section>
    </PageLayout>
  );
}
