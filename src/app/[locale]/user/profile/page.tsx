'use client';
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, signOut } = useUserStore();

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
          <Button onClick={signOut} className="mt-4">Sign Out</Button>
        </>
      ) : (
        <h1 className="text-3xl font-bold">Please log in to view your profile</h1>
      )}
    </div>
  );
};

export default ProfilePage;
