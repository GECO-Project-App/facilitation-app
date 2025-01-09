'use client';
import {Button, Header, PageLayout} from '@/components';
import {DeadlineForm} from '@/components/forms/DeadlineForm';
import {useRouter} from '@/i18n/routing';
import {createTutorialToMe} from '@/lib/actions/createTutorialToMeActions';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTeamStore} from '@/store/teamStore';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

export default function DefineTimeForTutorialToMePage() {
  const t = useTranslations('exercises.deadline');
  const {deadline} = useExerciseStore();
  const {writingDate, reviewingDate, writingTime, reviewingTime} = useTutorialToMe();
  const [loading, setLoading] = useState(false);
  const {currentTeam} = useTeamStore();
  const router = useRouter();

  const createExercise = () => {
    if (!currentTeam) return;
    setLoading(true);
    const savedData = {
      team_id: currentTeam.id,
      writing_date: writingDate
        ? new Date(writingDate.getTime() - writingDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0]
        : '',
      writing_time: writingTime ?? '',
      reviewing_date: reviewingDate
        ? new Date(reviewingDate.getTime() - reviewingDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0]
        : '',
      reviewing_time: reviewingTime ?? '',
    };
    console.log(savedData);
    createTutorialToMe(savedData)
      .then((res) => {
        const exerciseId = res?.data?.[0].exercise_id;
        if (exerciseId) {
          router.push(`/exercises/tutorial-to-me/id/${exerciseId}`);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={
        <Button
          variant="white"
          onClick={createExercise}
          disabled={!deadline.writingPhase || !deadline.reviewingPhase}>
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
