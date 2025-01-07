'use client';
import {RiveAnimation} from '@/components';
import {Header} from '@/components/Header';
import {PageLayout} from '@/components/PageLayout';
import ReviewComponent from '@/components/tutorial-to-me/review/ReviewComponent';
import WaitingForOthers from '@/components/tutorial-to-me/review/WaitingForOthers';
import {Button} from '@/components/ui';
import {useDoneTutorialExercise} from '@/hooks/useDoneExercise';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {useToast} from '@/hooks/useToast';
import {Link} from '@/i18n/routing';
import {updateReviewAndActiveTutorialToMe} from '@/lib/actions/createTutorialToMeActions';
// import {useExercisesStore} from '@/store/useExercises';
import {ArrowLeft} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useParams, useRouter} from 'next/navigation';
import {FC} from 'react';

const Review: FC = () => {
  const t = useTranslations('exercises.tutorialToMe');
  const {isAllDone, theTimePassed, reviewDone} = useDoneTutorialExercise();
  // const {exercises} = useExercisesStore();
  const {allReviewsDone, removeLocalStorageItem} = useSSCChaptersHandler();
  const router = useRouter();
  const {toast} = useToast();
  const {slug} = useParams();
  const handleClick = async () => {
    if (allReviewsDone()) {
      const result = await updateReviewAndActiveTutorialToMe(slug as string);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: t('review.toast.error'),
        });
      }
      router.push('/exercises/tutorial-to-me/feedback');
      toast({
        variant: 'transparent',
        size: 'fullscreen',
        duration: 2500,
        className: 'text-black bg-blue',
        children: (
          <>
            <h3 className="text-3xl font-bold">{t('greatJob')}</h3>
            <RiveAnimation src="geckograttis.riv" width={300} height={300} />
          </>
        ),
      });
      removeLocalStorageItem('reviewDone');
    } else {
      router.push('/');
    }
  };

  return (
    <PageLayout
      hasPadding={false}
      backgroundColor={`bg-purple`}
      header={
        <Header
          showBackButton={false}
          leftContent={
            <Link href={'/'}>
              <ArrowLeft size={42} />
            </Link>
          }></Header>
      }
      footer={
        <Button
          variant="blue"
          className="mx-auto"
          disabled={!allReviewsDone()}
          onClick={handleClick}>
          {isAllDone ? t('reviewComplete') : t('backToHome')}
        </Button>
      }>
      {reviewDone ? (
        <WaitingForOthers message="Review" />
      ) : isAllDone || theTimePassed ? (
        <ReviewComponent />
      ) : (
        <WaitingForOthers />
      )}
    </PageLayout>
  );
};

export default Review;
