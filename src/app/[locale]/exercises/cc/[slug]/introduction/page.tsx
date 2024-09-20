import {About} from '@/components';
import {ccMock} from '@/lib/mock';

export default function IntroductionPage({params}: {params: {locale: string; slug: string}}) {
  const {slug} = params;

  return <About {...(slug === 'check-in' ? ccMock.checkIn.about : ccMock.checkOut.about)} />;
}
