import {PassItOn} from '@/components';

export default async function PassItOnPage({params}: {params: {localew: string}}) {
  return (
    <main className="bg-blue">
      <PassItOn />
    </main>
  );
}
