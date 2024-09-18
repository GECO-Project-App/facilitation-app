import {getDictionary} from '../../../dictionaries';
import {getSsdData} from '@/lib/ssc-mock-data';
import SSCExercise from '@/components/ssc-exercise';
import Tips from '@/components/ssc-exercise/Tips';
import FeedBack from '@/components/ssc-exercise/FeedBack';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function SSC({params}: {params: {lang: string; slug: string}}) {
  const t = await getDictionary(params.lang);
  const slug = params.slug;
  const data = getSsdData(slug);

  switch (slug) {
    case 'tips':
      return <Tips />;
    case 'feedback':
      return <FeedBack />;
    default:
      return (
        <main
          className={`flex min-h-screen flex-col ${
            slug === 'start' ? 'bg-yellow' :
            slug === 'stop' ? 'bg-red' :
            slug === 'continue' ? 'bg-green' : 'bg-blue'
          }`}>
            {data && <SSCExercise data={data} chapter={slug} />}
        </main>
      );
  }
}
