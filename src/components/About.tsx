'use client';
import {AboutProps} from '@/lib/mock';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {FC} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui';
import {usePostHog} from 'posthog-js/react';
import {usePathname} from 'next/navigation';

export const About: FC<AboutProps> = ({
  title,
  subtitle,
  description,
  rive,
  illustration,
  button,
}) => {
  const posthog = usePostHog();
  const pathname = usePathname();

  const handleClick = () => {
    posthog.capture('exercise_start', {
      name: title,
      slug: pathname,
    });
  };

  return (
    <section className="page-padding flex min-h-screen flex-col justify-between">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        <div className="relative aspect-video w-full self-start md:w-2/3">
          {rive && <RiveAnimation src={rive} />}
          {illustration && <Image src={illustration} alt={title} fill />}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{title} </h2>
            <p className="text-sm font-light">{subtitle}</p>
          </div>
          <p>{description}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant={button.variant} asChild onClick={handleClick}>
          <Link href={button.link}>
            {button.text} <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </section>
  );
};
