'use client';
import {RiveAnimation} from '@/components';
import {Header} from '@/components/Header';
import {PageLayout} from '@/components/PageLayout';
import ReviewCompleted from '@/components/tutorial-to-me/review/ReviewCompleted';
import ReviewNotCompleted from '@/components/tutorial-to-me/review/ReviewNotCompleted';
import {Button} from '@/components/ui';
import {useDoneTutorialExercise} from '@/hooks/useDoneExercise';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {useToast} from '@/hooks/useToast';
import {Link} from '@/i18n/routing';
import {ArrowLeft} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {FC} from 'react';

const Review: FC = () => {
  const t = useTranslations('exercises.tutorialToMe');
  const {isAllDone, theTimePassed} = useDoneTutorialExercise();
  const {allReviewsDone, removeLocalStorageItem} = useSSCChaptersHandler();
  const router = useRouter();
  const {toast} = useToast();

  const handleClick = () => {
    if (allReviewsDone()) {
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
      {isAllDone || theTimePassed ? <ReviewCompleted /> : <ReviewNotCompleted />}
    </PageLayout>
  );
};

export default Review;
