import {Header, LanguageSelector, PageLayout, ProfileForm} from '@/components';
import {Settings} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

export default async function SettingsPage() {
  const t = await getTranslations('settings');

  return (
    <PageLayout
      header={
        <Header
          showBackButton={false}
          rightContent={
            <div className="flex flex-row items-center gap-2">
              <h4 className=" font-bold">{t('title')}</h4>
              <Settings size={24} />
            </div>
          }
        />
      }>
      <div className="flex flex-col gap-8  w-full justify-center items-center">
        <LanguageSelector />
        <ProfileForm />
      </div>
    </PageLayout>
  );
}
