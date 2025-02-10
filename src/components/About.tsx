'use client';
import {Link, useRouter} from '@/i18n/routing';
import {ccMock, sscMock, tutorialMock} from '@/lib/mock';
import {checkExerciseAvailibility} from '@/lib/utils';
import {useExerciseStore} from '@/store/exerciseStore';
import {useTeamStore} from '@/store/teamStore';
import {useUserStore} from '@/store/userStore';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {usePostHog} from 'posthog-js/react';
import {FC, useEffect, useMemo} from 'react';
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
  const {isFacilitator, currentTeam} = useTeamStore();
  const {exercise, getExerciseBySlugAndTeamId} = useExerciseStore();
  const {user} = useUserStore();
  const t = useTranslations('common');

  useEffect(() => {
    if (currentTeam) {
      getExerciseBySlugAndTeamId(slug, currentTeam.id);
    }
  }, [slug, currentTeam, getExerciseBySlugAndTeamId]);

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
      case 'ttm':
        return tutorialMock.about;
      default:
        return ccMock.checkOut.about;
    }
  }, [slug]);

  const exerciseLink = useMemo(() => {
    return exercise
      ? exercise.status === 'completed' && isFacilitator
        ? `/exercises/${slug}/deadline`
        : `/exercises/${slug}?id=${exercise.id}&status=${exercise.status}`
      : isFacilitator
        ? `/exercises/${slug}/deadline`
        : `/exercises/${slug}`;
  }, [isFacilitator, exercise, slug]);

  return (
    <PageLayout
      header={<Header onBackButton={() => router.push('/')} />}
      footer={
        checkExerciseAvailibility(slug, isFacilitator, user, exercise) ? (
          <Button variant={mock.button.variant} asChild onClick={handleClick} className="mx-auto">
            <Link href={exerciseLink}>
              {buttonText} <ArrowRight size={28} />
            </Link>
          </Button>
        ) : (
          <Button variant={mock.button.variant} asChild disabled className="mx-auto">
            {t('exerciseBlocked')}
          </Button>
        )
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
        {!hideTeamSelect && user !== null && (slug == 'ttm' || slug == 'ssc') && (
          <>
            <TeamSelect disableCreateOrJoin className="w-fit min-w-28 mx-auto" />
            <TeamCard />
          </>
        )}
      </div>
    </PageLayout>
  );
};
