'use client';
import {Button, NavBar} from '@/components';
import {useSearchParams} from 'next/navigation';
import Start from '@/components/ssc-exercise/introduction/Start';
import Stop from '@/components/ssc-exercise/introduction/Stop';
import Continue from '@/components/ssc-exercise/introduction/Continue';
import {Link} from '@/navigation';

export default function Introduction() {
  const searchParams = useSearchParams();
  const chapter = searchParams.get('chapter');
  return (
    <main className="page-padding flex min-h-screen flex-col bg-white">
      <section className="flex flex-1 flex-col items-center justify-evenly">
        {chapter === 'start' && <Start />}
        {chapter === 'stop' && <Stop />}
        {chapter === 'continue' && <Continue />}
        <Link href={`/exercises/ssc/${chapter}`}>
          <Button variant="blue" className="mx-auto">
            Let's start
          </Button>
        </Link>
      </section>
    </main>
  );
}
