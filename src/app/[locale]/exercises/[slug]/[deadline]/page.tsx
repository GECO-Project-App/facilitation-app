'use client';
import {Button, Header, PageLayout} from '@/components';
import {DeadlineForm} from '@/components/forms/DeadlineForm';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTranslations} from 'next-intl';

export default function ExerciseDeadlinePage() {
  const t = useTranslations('exercises.deadline');
  const {deadline} = useExerciseStore();

  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={
        <Button variant="white" disabled={!deadline.writingPhase || !deadline.reviewingPhase}>
          {t('nextStep')}
        </Button>
      }>
      <section className=" space-y-6 flex flex-col ">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="mt-4 text-lg">{t('description')}</p>
        </div>
        <DeadlineForm />
      </section>
    </PageLayout>
  );
}
