import {Button, RandomQuestion, Timer} from '@/components';
import {ArrowRight} from 'lucide-react';
import {getDictionary} from '../dictionaries';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Checkin({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Timer seconds={3} />

      <RandomQuestion />
      <Button variant="pass" hasShadow>
        Pass it on <ArrowRight size={28} />
      </Button>
    </main>
  );
}
