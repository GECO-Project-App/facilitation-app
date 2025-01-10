'use client';
import {useSSCChaptersHandler} from '@/hooks/useSSCChaptersHandler';
import {Link, useRouter} from '@/i18n/routing';
import {ccMock, sscMock, tutorialMock} from '@/lib/mock';
import {useTeamStore} from '@/store/teamStore';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import {usePostHog} from 'posthog-js/react';
import {FC, useMemo} from 'react';
import {Header} from './Header';
import {PageLayout} from './PageLayout';
import {RiveAnimation} from './RiveAnimation';
import {TeamCard} from './TeamCard';
import {TeamSelect} from './TeamSelect';
import {Button} from './ui';

export const About: FC<{
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  hideTeamSelect?: boolean;
}> = ({slug, title, subtitle, description, buttonText, hideTeamSelect = false}) => {
  const router = useRouter();
  const posthog = usePostHog();

  const {removeLocalStorageItem} = useSSCChaptersHandler();
  //TODO: Fetch exercise from database and set user to exercise/name/id if a facilitator has created an exercise - if user is a facilitator > send to / deadline to create exercise

  const {isFacilitator} = useTeamStore();

  const handleClick = () => {
    removeLocalStorageItem('reviewDone');
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

  return (
    <PageLayout
      header={<Header onBackButton={() => router.push('/')} />}
      footer={
        <Button variant={mock.button.variant} asChild onClick={handleClick} className="mx-auto">
          <Link href={isFacilitator ? `/exercises/${slug}/deadline` : `/exercises/${slug}`}>
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
        </div>
        {!hideTeamSelect && (
          <>
            <TeamSelect disableCreateOrJoin className="w-fit min-w-28 mx-auto" />
            <TeamCard />
          </>
        )}
      </div>
    </PageLayout>
  );
};
