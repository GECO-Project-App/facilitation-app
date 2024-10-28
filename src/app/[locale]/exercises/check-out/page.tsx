'use client';
import {Button, Header, PageLayout, RandomQuestion} from '@/components';
import {Link, usePathname} from '@/i18n/routing';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function CheckOutPage() {
  const pathname = usePathname();
  const t = useTranslations('exercises.checkOut');
  const slug = pathname.split('/').pop();

  const questions: string[] = t.raw('questions').map((question: string) => question);

  return (
    <PageLayout
      backgroundColor="bg-green"
      header={<Header />}
      footer={
        <Button variant="blue" asChild className="mx-auto">
          <Link href={`/exercises/${slug}/pass-it-on`}>
            {t('passItOnButton')} <ArrowRight size={28} />
          </Link>
        </Button>
      }>
      <RandomQuestion questions={questions} />
    </PageLayout>
  );
}
