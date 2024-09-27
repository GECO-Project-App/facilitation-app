import React from 'react';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Link} from '@/navigation';

const FeedBack: React.FC = () => {
  return (
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-yellow">
      <section className="flex w-full flex-row items-center justify-evenly gap-4">
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
        <Button variant="yellow">Send Us Feedback</Button>
      </section>
    </main>
  );
};

export default FeedBack;
