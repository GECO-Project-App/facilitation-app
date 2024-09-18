import {About, Button, NavBar, RiveAnimation} from '@/components';
import {ccMock} from '@/lib/mock';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';

export default function IntroductionPage({params}: {params: {lang: string; slug: string}}) {
  const {slug} = params;

  return <About {...(slug === 'check-in' ? ccMock.checkIn.about : ccMock.checkOut.about)} />;
}
