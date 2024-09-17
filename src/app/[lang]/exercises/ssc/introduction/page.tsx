'use client';
import {Button, NavBar} from '@/components';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import Start from '@/components/ssc-exercise/introduction/Start';
import Stop from '@/components/ssc-exercise/introduction/Stop';
import Continue from '@/components/ssc-exercise/introduction/Continue';

export default function Introduction() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  return (
    <main className="page-padding flex min-h-screen flex-col bg-white">
      <section className="flex flex-1 flex-col items-center justify-evenly">
        {step === 'start' && <Start />}
        {step === 'stop' && <Stop />}
        {step === 'continue' && <Continue />}
        <Link href={`/exercises/ssc/${step}`}>
          <Button variant="pink" className="mx-auto">
            Let's start
          </Button>
        </Link>
      </section>
    </main>
  );
}
