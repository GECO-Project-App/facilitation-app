import {Button, RiveAnimation} from '@/components';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';

export default async function Accomplishment({params}: {params: {locale: string}}) {
  return (
    <main className="page-padding flex min-h-screen flex-col bg-blue">
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto w-fit text-center text-white">
          <div className="mb-12">
            <h1 className="text-4xl font-bold">GREAT JOB!</h1>
            <h2 className="text-xl font-bold">YOU DID IT! GRATTIS!</h2>
          </div>
          <div className="flex flex-col items-center space-y-12">
            <div className="m-2 mx-auto rounded-full bg-pink p-2">
              <RiveAnimation src="geckograttis.riv" />
            </div>
            <Link href={'/exercises/ssc/'}>
              <Button variant="red" className="mx-auto">
                Go to home
                <ArrowRight size={28} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
