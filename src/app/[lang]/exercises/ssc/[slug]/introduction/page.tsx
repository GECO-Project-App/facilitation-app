import {About} from '@/components';
import {sscMock} from '@/lib/mock';
import {useMemo} from 'react';

export default function ChapterIntroductionPage({params}: {params: {lang: string; slug: string}}) {
  const {slug} = params;

  const data = useMemo(() => {
    switch (slug) {
      case 'start':
        return sscMock.start.about;
      case 'stop':
        return sscMock.stop.about;
      case 'continue':
        return sscMock.continue.about;
      default:
        return sscMock.start.about;
    }
  }, [slug]);

  return <About {...data} />;
}
