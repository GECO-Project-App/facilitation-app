import Image from 'next/image';
import {Button, LanguageSwitcher, Timer} from '@/components';
import {getDictionary} from './dictionaries';
import {ArrowRight} from 'lucide-react';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Home({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LanguageSwitcher />

      <Timer seconds={10} />

      <Button variant="checkin" hasShadow>
        Check in <ArrowRight size={28} />
      </Button>
      <p> {t.home.title}</p>

      {t.home.desc}
    </main>
  );
}
