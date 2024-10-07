'use client';
import {ccMock, sscMock} from '@/lib/mock';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import {usePostHog} from 'posthog-js/react';
import {FC, useMemo} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui';
import {PageLayout} from './PageLayout';
import {Header} from './Header';

export const About: FC<{
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}> = ({slug, title, subtitle, description, buttonText}) => {
  const posthog = usePostHog();

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
      default:
        return ccMock.checkOut.about;
    }
  }, [slug]);

  return (
    <PageLayout
      header={<Header />}
      footer={
        <Button variant={mock.button.variant} asChild onClick={handleClick} className="mx-auto">
          <Link href={mock.button.link}>
            {buttonText} <ArrowRight size={28} />
          </Link>
        </Button>
      }>
      <div className="space-y-6">
        {mock?.rive && <RiveAnimation src={mock.rive} />}
        {mock?.illustration && (
          <div className="relative aspect-video w-full self-start md:w-2/3">
            <Image src={mock.illustration} alt={title} fill />
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{title} </h2>
            <p className="text-sm font-light">{subtitle}</p>
          </div>
          <p>{description}</p>
        </div>
      </div>
    </PageLayout>
  );
};
