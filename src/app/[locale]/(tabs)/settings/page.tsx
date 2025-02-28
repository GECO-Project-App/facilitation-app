import {
  EmailSettings,
  Header,
  LanguageSelector,
  NotificationSettings,
  PageLayout,
  ProfileForm,
} from '@/components';
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
              <h4 className="font-bold">{t('title')}</h4>
              <Settings size={24} />
            </div>
          }
        />
      }>
      <div className="flex flex-col gap-8 flex-1 w-full items-center pb-6">
        <LanguageSelector />
        <div className="flex flex-col justify-center items-center w-full flex-1 gap-8 ">
          <NotificationSettings />
          <hr className="w-full" />
          <EmailSettings />
          <hr className="w-full" />
          <ProfileForm />
        </div>
      </div>
    </PageLayout>
  );
}
