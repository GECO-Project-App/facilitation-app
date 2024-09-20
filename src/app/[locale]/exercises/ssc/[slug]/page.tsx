import {getSsdData} from '@/lib/ssc-mock-data';
import SSCExercise from '@/components/ssc-exercise';
import Tips from '@/components/ssc-exercise/Tips';
import FeedBack from '@/components/ssc-exercise/FeedBack';

export default async function SSC({params}: {params: {locale: string; slug: string}}) {
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
            slug === 'start'
              ? 'bg-yellow'
              : slug === 'stop'
                ? 'bg-red'
                : slug === 'continue'
                  ? 'bg-green'
                  : 'bg-blue'
          }`}>
          {data && <SSCExercise data={data} chapter={slug} />}
        </main>
      );
  }
}
