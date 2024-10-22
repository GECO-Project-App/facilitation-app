'use client';
import {DefaultProfileImage} from '@/components/icons/astro-geco';
import {Button} from '@/components/ui/button';
import {useRouter} from '@/i18n/routing';
import {useUserStore} from '@/store/userStore';

const ProfilePage = () => {
  const {user, signOut} = useUserStore();
  const router = useRouter();
  const logOut = () => {
    signOut();
    router.push('/');
  };

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
          <section>
            <Button onClick={logOut} className="mt-4">
              Log out
            </Button>
          </section>
        </div>
      ) : (
        <h1 className="text-xl font-bold">Please log in to view your profile</h1>
      )}
    </div>
  );
};

export default ProfilePage;
