import {getDictionary} from '../../../dictionaries';

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
    <main className="page-padding flex min-h-screen flex-col bg-blue">
      <section className="flex flex-1 flex-col items-center justify-evenly">
        Start Stop Continue Details
      </section>
    </main>
  );
}
