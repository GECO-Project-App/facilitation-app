'use client';
import {Button, Header, PageLayout} from '@/components';
import {DeadlineForm} from '@/components/forms/DeadlineForm';
import {useRouter} from '@/i18n/routing';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTeamStore} from '@/store/teamStore';
import {useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';

export default function ExerciseDeadlinePage() {
  const router = useRouter();
  const t = useTranslations('exercises.deadline');
  const {deadline, createExercise} = useExerciseStore();
  const {currentTeam} = useTeamStore();
  const {slug} = useParams();

  const handleClick = async () => {
    if (!currentTeam || !deadline.writingPhase || !deadline.reviewingPhase) return;

    const exercise = await createExercise({
      teamId: currentTeam.id,
      slug: slug as string,
      deadline: {
        writing: new Date(deadline.writingPhase).toISOString(),
        reviewing: new Date(deadline.reviewingPhase).toISOString(),
      },
    });

    if (!exercise) return;

    router.push(`/exercises/${slug}/${exercise.id}`);
  };

  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={
        <Button
          variant="white"
          disabled={!deadline.writingPhase || !deadline.reviewingPhase}
          onClick={handleClick}>
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
