import {Button, RiveAnimation} from '@/components';
import {Link} from '@/navigation';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getTranslations('home');
  return {
    title: t('title'),
    description: t('desc'),
  };
}

export default async function Home() {
  const t = await getTranslations('home.buttons');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-orange p-24">
      <div className="flex flex-col items-center gap-4">
        <RiveAnimation src="bulbgecko.riv" height={160} width={160} />
        <h1 className="text-5xl font-bold uppercase tracking-[0.3em]">GECO</h1>
      </div>
      <div className="flex flex-col gap-6">
        <Button variant="purple" asChild className="w-full">
          <Link href={'/exercises/cc/introduction'}>{t('cc')}</Link>
        </Button>
        <Button variant="blue" asChild>
          <Link href={'/exercises/ssc/introduction'}>{t('ssc')}</Link>
        </Button>
      </div>
    </main>
  );
}
