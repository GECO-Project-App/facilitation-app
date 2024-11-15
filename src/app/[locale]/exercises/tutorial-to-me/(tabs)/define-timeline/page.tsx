'use client';
import {Button, Header, PageLayout} from '@/components';
import {DateAndTimePicker} from '@/components/date-and-time-picker/DateAndTimePicker';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

export default function DefineTimeForTutorialToMePage() {
  const t = useTranslations('exercises.tutorialToMe');
  const {writingDate, reviewingDate} = useTutorialToMe();
  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={
        <Button variant="white" disabled={!writingDate || !reviewingDate}>
          <Link href={`/exercises/tutorial-to-me/id/create`}>
            <span className="flex items-center gap-2">
              {t('nextStep')}
              <ArrowRight size={28} />
            </span>
          </Link>
        </Button>
      }>
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
