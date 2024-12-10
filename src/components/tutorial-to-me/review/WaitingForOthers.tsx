import {RiveAnimation} from '@/components/RiveAnimation';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
import UsersNotCompletedTutorialToMeReview from '../UsersNotCompletedTutorialToMeReview';
import UsersNotCompletedTutorialToMeTask from '../UsersNotCompletedTutorialToMeTask';

const WaitingForOthers: FC<{message?: string}> = ({message}) => {
  const t = useTranslations('exercises.tutorialToMe');
  return (
    <section className="flex flex-col items-center justify-evenly h-full space-y-8">
      <h2 className="text-2xl font-bold">{t('waiting')}</h2>
      <RiveAnimation src="timer.riv" width={300} height={300} />
      <p className="px-4">
        {t('waitingForOthersP1')}
        <UsersNotCompletedTutorialToMeTask />
        <UsersNotCompletedTutorialToMeReview />
        {t('waitingForOthersP2')}
      </p>
    </section>
  );
};

export default WaitingForOthers;
