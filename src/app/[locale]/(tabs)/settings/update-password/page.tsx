import {PageLayout, UpdatePasswordForm} from '@/components';
import {getTranslations} from 'next-intl/server';

export default async function UpdatePasswordPage() {
  const t = await getTranslations('authenticate');

  return (
    <PageLayout>
      <section className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">{t('updatePassword.title')}</h2>

        <UpdatePasswordForm />
      </section>
    </PageLayout>
  );
}
