import {DefaultProfileImage} from '@/components/icons/astro-geco';
import {Button} from '@/components/ui/button';
import {logOut} from '@/lib/actions';
import {createClient} from '@/lib/supabase/server';
export default async function ProfilePage() {
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
            Welcome
            <br />
            {user.user_metadata.displayName}
          </p>
          <DefaultProfileImage />
          <section>
            <p className="text-xl">First Name: {user.user_metadata.firstName}</p>
            <p className="text-xl">Last Name: {user.user_metadata.lastName}</p>
            <p className="text-xl">Email: {user.email}</p>
          </section>
          <form>
            <Button formAction={logOut} className="mt-4">
              Log out
            </Button>
          </form>
        </div>
      ) : (
        <h1 className="text-xl font-bold">Please log in to view your profile</h1>
      )}
    </div>
  );
}
