import {PassItOn} from '@/components';
import {getDictionary} from '../../dictionaries';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function Popcorn({params}: {params: {lang: string}}) {
  const t = await getDictionary(params.lang);

  return (
    <main className="bg-blue">
      <PassItOn />
    </main>
  );
}
