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
          <h1 className="text-2xl font-bold">Check In-Check Out Exercise </h1>
          <p className="text-sm font-light">5-15 minutes | 2-20 members</p>
          <p>
            This exercise is designed to help you understand the importance of checking in and
            checking out of your work.
          </p>
        </div>
        <Button variant="yellow" asChild className="mx-auto">
          <Link href={'/exercises/cc'}>
            Start <ArrowRight size={28} />
          </Link>
        </Button>
      </div>
    </main>
  );
}
