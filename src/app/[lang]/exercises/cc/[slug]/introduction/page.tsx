import {About, Button, NavBar, RiveAnimation} from '@/components';
import {ccMock} from '@/lib/mock';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {useMemo} from 'react';

export default function CCIntroductionPage({params}: {params: {lang: string; slug: string}}) {
  const {slug} = params;

  const data = useMemo(() => {
    switch (slug) {
      case 'check-in':
        return ccMock.checkIn.about;
      case 'check-out':
        return ccMock.checkOut.about;
      default:
        return ccMock.checkIn.about;
    }
  }, [slug]);

  return <About {...data} />;
}
