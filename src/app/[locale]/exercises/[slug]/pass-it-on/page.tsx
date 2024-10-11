import {PassItOn} from '@/components';

export default async function PassItOnPage({params}: {params: {slug: string}}) {
  const {slug} = params;

  return <PassItOn slug={slug} />;
}
