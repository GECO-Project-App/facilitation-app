import PostHogClient from '@/lib/PostHogClient';
import Image from 'next/image';
import {FC} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';
import {Button} from './ui';
import type {ButtonProps} from './ui/button';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {AboutProps} from '@/lib/mock';

export const About: FC<AboutProps> = async ({
  title,
  subtitle,
  description,
  rive,
  illustration,
  button,
}) => {
  const posthog = PostHogClient();

  await posthog.capture({
    distinctId: 'exercise_tracking',
    event: 'exercise_start',
    properties: {
      title,
    },
  });

  return (
    <section className="page-padding flex min-h-screen flex-col justify-between">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        {rive && <RiveAnimation src={rive} width={300} />}
        {illustration && (
          <div className="relative aspect-video w-full self-start md:w-2/3">
            <Image src={illustration} alt={title} fill />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{title} </h2>
            <p className="text-sm font-light">{subtitle}</p>
          </div>
          <p>{description}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant={button.variant} asChild>
          <Link href={button.link}>
            {button.text} <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </section>
  );
};
