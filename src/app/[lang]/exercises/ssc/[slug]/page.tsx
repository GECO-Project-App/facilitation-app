
import {getDictionary} from '../../../dictionaries';
import {getSsdData} from '@/lib/ssc-mock-data';
import SSCExercise from '@/components/ssc-exercise';
import Tips from '@/components/ssc-exercise/Tips';
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

  if (slug === 'tips') return <Tips />

  return (
    <main
      className={`page-padding flex min-h-screen flex-col ${params.slug === 'start' ? 'bg-green' : params.slug === 'stop' ? 'bg-orange' : params.slug === 'continue' ? 'bg-pink' : 'bg-blue'}`}>
      <section className="flex flex-1 flex-col items-center justify-evenly">
        {data && <SSCExercise data={data} />}
      </section>
      {/* <Button variant="checkin" hasShadow className="mx-auto">
        Next Step
      </Button> */}
    </main>
  );
}
