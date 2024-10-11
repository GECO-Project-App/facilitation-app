'use client';
import {useUserStore} from '@/store/userStore';
import {Button} from '@/components/ui/button';
import {DefaultProfileImage} from '@/components/icons/astro-geco';
import Link from 'next/link';

const ProfilePage = () => {
  const {user, signOut} = useUserStore();

  return (
    <div className="overflow-hidden bg-sky-300">
      {user ? (
        <div className="flex min-h-dvh flex-col items-center justify-evenly">
          <p className="text-xl">Welcome, {user.user_metadata.displayName}</p>
          <DefaultProfileImage />
          <section>
            <p className="text-xl">First Name: </p>
            <p className="text-xl">Last Name: </p>
            <p className="text-xl">Email: {user.email}</p>
          </section>
          <section>
          <Button onClick={signOut} className="mt-4">
            Log out
          </Button>
          <Button className="mt-4" variant="yellow">
            <Link href="./profile/edit/">
              Edit Profile
            </Link>
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
