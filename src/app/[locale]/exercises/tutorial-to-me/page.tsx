import {Header, PageLayout} from '@/components';
import {Button} from '@/components/ui/button/button';
import {Link} from '@/navigation';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
export default async function TutorialToMePage() {
  const t = await getTranslations('exercises.tutorialToMe');
  return (
    <PageLayout
      backgroundColor="bg-red"
      header={<Header />}
      footer={
        <Button variant="blue" asChild className="mx-auto">
          <Link href={`/`}>
            {t('nextStep')} <ArrowRight size={28} />
          </Link>
        </Button>
      }>
      Start
    </PageLayout>
  );
}
