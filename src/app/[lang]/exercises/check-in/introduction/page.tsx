import {Button, NavBar, RiveAnimation} from '@/components';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';

export default function IntroductionPage() {
  return (
    <main className="page-padding flex min-h-screen flex-col justify-between bg-purple">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        <RiveAnimation src="/assets/riv/checkinout.riv" width={300} />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check In Exercise </h1>
          <p className="text-sm font-light">5-15 minutes | 2-20 members</p>
          <p>
            Check Ins are activities that help facilitators gather insights into the current
            thoughts or emotions of each group member. These can range from simple to more in-depth
            activities, such as, thumbs Up/thumbs Down, feelings check in, rate my day.
          </p>
        </div>
        <Button variant="yellow" asChild className="mx-auto">
          <Link href={'/exercises/check-in'}>
            Let's Start <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </main>
  );
}
