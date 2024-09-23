import {FC, useMemo} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Button} from './ui';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {ccMock} from '@/lib/mock';

type AboutProps = {
  slug: string;
};

export const About: FC<AboutProps> = async ({slug}) => {
  const mock = useMemo(() => {
    switch (slug) {
      case 'check-in':
        return ccMock.checkIn.about;
      case 'check-out':
        return ccMock.checkOut.about;
      case 'start':
        return ccMock.checkOut.about;
      case 'stop':
        return ccMock.checkOut.about;
      case 'continue':
        return ccMock.checkOut.about;
      default:
        return ccMock.checkOut.about;
    }
  }, [slug]);

  const t = await useMemo(async () => {
    switch (slug) {
      case 'check-in':
        return getTranslations('exercises.cc.checkIn');
      case 'check-out':
        return getTranslations('exercises.cc.checkOut');
      case 'start':
        return getTranslations('exercises.ssc.start');
      case 'stop':
        return getTranslations('exercises.ssc.stop');
      case 'continue':
        return getTranslations('exercises.ssc.continue');
      default:
        return getTranslations('exercises.cc.checkIn');
    }
  }, [slug]);

  return (
    <section className="page-padding flex min-h-screen flex-col justify-between">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4">
        {/* {mock?.rive && <RiveAnimation src={mock.rive} width={300} />} */}
        <div className="relative aspect-video w-full self-start md:w-2/3">
          {mock?.illustration && <Image src={mock.illustration} alt="illustration" fill priority />}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('title')} </h2>
            <p className="text-sm font-light">{t('subtitle')}</p>
          </div>
          <p>{t('description')}</p>
        </div>
      </div>
      <div className="flex justify-center">{mock.button(t('button'))}</div>
    </section>
  );
};
