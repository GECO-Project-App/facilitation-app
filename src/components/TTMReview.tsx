'use client';
import {Button, DateBadge, Header, PageLayout, SwipeFeed} from '@/components';
import {Complete} from '@/components/icons';
import {WaitingFor} from '@/components/WaitingFor';
import {useRouter} from '@/i18n/routing';
import {PendingUsers} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

export const TTMReview = () => {
  //TODO: status != review -> Show waiting screen
  const router = useRouter();
  const t = useTranslations('exercises.tutorialToMe');
  const searchParams = useSearchParams();
  const {getPendingSubmissions, pendingUsers, exercise} = useExerciseStore();

  useEffect(() => {
    if (exercise?.id && exercise.status === 'review') {
      getPendingSubmissions(exercise.id);
    }
  }, [exercise?.id, getPendingSubmissions, exercise?.status]);

  if (pendingUsers) {
    return (
      <WaitingFor
        people={pendingUsers.map((user: PendingUsers) => `${user.firstName} ${user.lastName}`)}
        deadline={new Date(exercise.deadline[exercise.status])}
      />
    );
  }

  if (searchParams.get('stage')) {
    return (
      <section className="min-h-svh h-full w-full p-8 max-w-lg mx-auto flex flex-col gap-4">
        <div className="hidden lg:block">
          <Header />
        </div>
        {/* <Progress value={50} /> */}
        <main className="flex-1 relative">
          <SwipeFeed stage={searchParams.get('stage') as string} />
        </main>
      </section>
    );
  }

  return (
    <PageLayout
      hasPadding={false}
      backgroundColor="bg-purple"
      header={<Header rightContent={<DateBadge date={new Date()} />} />}
      footer={
        <Button variant="white">
          Review complete <Complete />
        </Button>
      }>
      <div className="divide-y-2 divide-black border-y-2 border-black border-x-2">
        {Object.keys(t.raw('stages')).map((stage, index) => (
          <div
            key={index}
            className={cn(
              'p-4 gap-4 flex flex-col pb-6',
              stage === 'strengths' && 'bg-yellow',
              stage === 'weaknesses' && 'bg-pink',
              stage === 'communication' && 'bg-orange',
            )}>
            <h3 className="text-2xl font-bold">{t(`stages.${stage}`)}</h3>
            <p>{t('review.description')}</p>
            <Button
              variant="white"
              size="small"
              className="mx-auto"
              onClick={() => router.push(`${window.location.href}&stage=${stage}`)}>
              Let&apos;s get started <ArrowRight />
            </Button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};
