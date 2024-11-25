import {AuthTabs, PageLayout, ProfileForm} from '@/components';
import {useUserStore} from '@/store/userStore';
import {getTranslations} from 'next-intl/server';

export default async function AuthPage() {
  const {user} = useUserStore.getState();

  const t = await getTranslations(['authenticate']);

  return (
    <PageLayout>
      {user ? (
        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">
            {t('profile.welcome', {name: user.user_metadata.first_name})}
          </h1>
          <ProfileForm user={user} />
        </section>
      ) : (
        <AuthTabs />
      )}
    </PageLayout>
  );
}
