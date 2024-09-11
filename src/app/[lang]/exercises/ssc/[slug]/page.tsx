import {getDictionary} from '../../../dictionaries';
import {getSsdData} from '@/lib/ssc-mock-data';
import {Button} from '@/components/ui/button';
import SSCExercise from '@/components/ssc-exercise';

export async function generateMetadata({params: {lang}}: {params: {lang: string}}) {
  const t = await getDictionary(lang);
  return {
    title: t.page.title,
    description: t.page.desc,
  };
}

export default async function SSC({params}: {params: {lang: string; slug: string; query: string}}) {
  const t = await getDictionary(params.lang);
  const data = getSsdData(params.slug);
  console.log(data)
  return (
    <main className="page-padding flex min-h-screen flex-col bg-green">
      <section className="flex flex-1 flex-col items-center justify-evenly">
        {data && <SSCExercise data={data} />}
      </section>
      <Button variant="checkin" hasShadow className="mx-auto">
        Next Step
      </Button>
    </main>
  );
}
