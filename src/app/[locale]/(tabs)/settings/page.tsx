import {AuthTabs, PageLayout, ProfileForm} from '@/components';
import {createClient} from '@/lib/supabase/server';

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  return <PageLayout>{user ? <ProfileForm user={user} /> : <AuthTabs />}</PageLayout>;
}
