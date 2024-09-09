import {Button} from '@/components';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import {getDictionary} from './dictionaries';

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
      <h1>Homepage</h1>

      <Link href={'/check-in'}>
        <Button variant="checkin" hasShadow>
          Check in <ArrowRight size={28} />
        </Button>
      </Link>
    </main>
  );
}
