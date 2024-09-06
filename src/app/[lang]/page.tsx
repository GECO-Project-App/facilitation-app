import Image from 'next/image';
import {Button, LanguageSwitcher, RandomQuestion, Timer} from '@/components';
import {getDictionary} from './dictionaries';
import {ArrowRight} from 'lucide-react';
import {mockQuestions} from '@/lib/mock';
import {getRandomUniqueItem} from '@/lib/utils';

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

      <Timer seconds={3} />

      <Button variant="checkin" hasShadow>
        Check in <ArrowRight size={28} />
      </Button>
      <RandomQuestion />
      <p> {t.home.desc}</p>
    </main>
  );
}
