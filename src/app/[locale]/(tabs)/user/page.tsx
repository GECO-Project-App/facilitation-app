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

  return <PageLayout>{user ? <ProfileForm user={user} /> : <AuthTabs />}</PageLayout>;
}
