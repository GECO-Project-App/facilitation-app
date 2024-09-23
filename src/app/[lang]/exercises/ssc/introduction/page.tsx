'use client';
import {About, Button, NavBar} from '@/components';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import Start from '@/components/ssc-exercise/introduction/Start';
import Stop from '@/components/ssc-exercise/introduction/Stop';
import Continue from '@/components/ssc-exercise/introduction/Continue';
import {useMemo} from 'react';
import {sscMock} from '@/lib/mock';

export default function Introduction() {
  const searchParams = useSearchParams();
  const chapter = searchParams.get('chapter');

  const data = useMemo(() => {
    switch (chapter) {
      case 'start':
        return sscMock.start.about;
      case 'stop':
        return sscMock.stop.about;
      case 'continue':
        return sscMock.continue.about;
      default:
        return sscMock.start.about;
    }
  }, [chapter]);

  return <About {...data} />;
}
