'use client';
import {Button, Header, PageLayout} from '@/components';
import {DateAndTimePicker} from '@/components/date-and-time-picker/DateAndTimePicker';
import {useRouter} from '@/i18n/routing';
import {createTutorialToMe} from '@/lib/actions/createTutorialToMeActions';
import {useTeamStore} from '@/store/teamStore';
import {useTutorialToMe} from '@/store/useTutorialToMe';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
export default function DefineTimeForTutorialToMePage() {
  const t = useTranslations('exercises.tutorialToMe');
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
          disabled={!writingDate || !reviewingDate || !writingTime || !reviewingTime || loading}>
          {/* <Link href={`/exercises/tutorial-to-me/id/create`}> */}
          <span className="flex items-center gap-2">
            {loading ? 'Loading...' : t('nextStep')}
            <ArrowRight size={28} />
          </span>
          {/* </Link> */}
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
