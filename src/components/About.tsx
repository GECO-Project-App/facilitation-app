'use client';
import {AboutProps, ccMock, sscMock} from '@/lib/mock';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {FC, useMemo} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui';
import {usePostHog} from 'posthog-js/react';
import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';

export const About: FC<{
  slug: string;
}> = ({slug}) => {
  const posthog = usePostHog();
  const pathname = usePathname();

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
      default:
        return ccMock.checkOut.about;
    }
  }, [slug]);

  const t = useMemo(() => {
    switch (slug) {
      case 'check-in':
        return useTranslations('exercises.cc.checkIn.about');
      case 'check-out':
        return useTranslations('exercises.cc.checkOut.about');
      case 'start':
        return useTranslations('exercises.ssc.start.about');
      case 'stop':
        return useTranslations('exercises.ssc.stop.about');
      case 'continue':
        return useTranslations('exercises.ssc.continue.about');
      default:
        return useTranslations('exercises.cc.checkIn.about');
    }
  }, [slug]);

  return (
    <section className="page-padding flex min-h-screen flex-col justify-between">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        {mock?.rive && <RiveAnimation src={mock.rive} />}
        {mock?.illustration && (
          <div className="relative aspect-video w-full self-start md:w-2/3">
            <Image src={mock.illustration} alt={t('title')} fill />
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('title')} </h2>
            <p className="text-sm font-light">{t('subtitle')}</p>
          </div>
          <p>{t('description')}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant={mock.button.variant} asChild onClick={handleClick}>
          <Link href={mock.button.link}>
            {mock.button.text} <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </section>
  );
};
