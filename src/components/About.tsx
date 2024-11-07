'use client';
import {Link} from '@/i18n/routing';
import {ccMock, sscMock, tutorialMock} from '@/lib/mock';
import {useExercisesStore} from '@/store/useExercises';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import {usePostHog} from 'posthog-js/react';
import {FC, useMemo} from 'react';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import InvOrDelMembers from './tutorial-to-me/inv-uninv-members';
import {Button} from './ui';

export const About: FC<{
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}> = ({slug, title, subtitle, description, buttonText}) => {
  const posthog = usePostHog();
  const {exercises} = useExercisesStore();

  const handleClick = () => {
    posthog.capture('exercise_start', {
      name: slug,
    });
  };

  const mock = useMemo(() => {
    switch (slug) {
      case 'check-in':
        return ccMock.checkIn.about;
      case 'check-out':
        return ccMock.checkOut.about;
      case 'start':
        return sscMock.start.about;
      case 'stop':
        return sscMock.stop.about;
      case 'continue':
        return sscMock.continue.about;
      case 'ssc':
        return sscMock.about;
      case 'tutorial-to-me':
        return tutorialMock.about;
      default:
        return ccMock.checkOut.about;
    }
  }, [slug]);

  const toturianExerciseId = exercises.find(
    (e) => e.type === 'tutorial_to_me' && e.isActive,
  )?.exerciseId;

  return (
    <PageLayout
      header={<Header />}
      footer={
        <Button variant={mock.button.variant} asChild onClick={handleClick} className="mx-auto">
          <Link
            href={
              toturianExerciseId && slug === 'tutorial-to-me'
                ? `/exercises/tutorial-to-me/id/${toturianExerciseId}`
                : mock.button.link
            }>
            {buttonText} <ArrowRight size={28} />
          </Link>
        </Button>
      }>
      <div className="space-y-6">
        {mock?.rive && (
          <div className="relative aspect-video w-2/3 mx-auto">
            <RiveAnimation src={mock.rive} width={220} height={220} />
          </div>
        )}
        {mock?.illustration && (
          <div className="relative mx-auto aspect-video w-2/3">
            <Image src={mock.illustration} alt={title} fill />
          </div>
        )}
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{title} </h2>
            <p className="font-light">{subtitle}</p>
          </div>
          <p>{description}</p>
          {slug === 'tutorial-to-me' && <InvOrDelMembers toturianExerciseId={toturianExerciseId} />}
        </div>
      </div>
    </PageLayout>
  );
};
