import {DefaultProfileImage} from '@/components/icons/astro-geco';
import {Button} from '@/components/ui/button';
import {logOut} from '@/lib/actions';
import {createClient} from '@/lib/supabase/server';
import {getTranslations} from 'next-intl/server';

export default async function ProfilePage() {
  const t = await getTranslations(['profile', 'common']);
  const supabase = createClient();
  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

  return (
    <div className="overflow-hidden bg-sky-300">
      {user ? (
        <div className="flex min-h-dvh flex-col items-center justify-evenly">
          <p className="text-xl text-center">
            {t('profile.welcome', {name: user.user_metadata.first_name})}
          </p>
          <DefaultProfileImage />
          <section>
            <p className="text-xl">
              {t('profile.metadata.firstName')}: {user.user_metadata.first_name}
            </p>
            <p className="text-xl">
              {t('profile.metadata.lastName')}: {user.user_metadata.last_name}
            </p>
            <p className="text-xl">
              {t('profile.metadata.email')}: {user.email}
            </p>
          </section>
          <form>
            <Button formAction={logOut} className="mt-4">
              {t('common.logOut')}
            </Button>
          </form>
        </div>
      ) : (
        <h1 className="text-xl font-bold">Please log in to view your profile</h1>
      )}
    </div>
  );
}
