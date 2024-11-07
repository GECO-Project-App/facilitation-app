import {AuthTabs, PageLayout, ProfileForm} from '@/components';
import {createClient} from '@/lib/supabase/server';
import {getTranslations} from 'next-intl/server';

export default async function AuthPage() {
  const supabase = createClient();
  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

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
