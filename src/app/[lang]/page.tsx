import {Button, Timer} from '@/components';
import {i18n} from '@/lib/i18n-config';
import {ArrowRight} from 'lucide-react';
import dynamic from 'next/dynamic';
import {getDictionary} from './dictionaries';

const DynamicLangSwitcher = dynamic(
  () => import('@/components/LanguageSwitch').then((mod) => mod.LanguageSwitcher),
  {
    ssr: false,
  },
);

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
      <DynamicLangSwitcher />

      <Timer seconds={10} />

      <Button variant="checkin" hasShadow>
        Check in <ArrowRight size={28} />
      </Button>
      <p> {t.home.title}</p>

      {t.home.desc}
    </main>
  );
}

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({lang}));
}
