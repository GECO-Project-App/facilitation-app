import React from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';

const FeedBack: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-evenly page-padding min-h-screen bg-yellow">
      <section className="w-full flex flex-row items-center gap-4 justify-evenly">
          <Link href={'/exercises/ssc'}>
            <ArrowLeft size={42} />
          </Link>
          <div className="text-xl font-bold">
            <h2>GECO App</h2>
            <h2>Start-Stop-Continue</h2>
            <h2>Exercise</h2>
          </div>
      </section>
        <h4 className="text-lg font-semibold">
          Have some thoughts, comments and suggestions about the app? Share your thought with us.
        </h4>
        <section className="flex justify-center">
          <Button variant="checkin" hasShadow>
            Send Us Feedback
          </Button>
        </section>
    </main>
  );
};

export default FeedBack;
