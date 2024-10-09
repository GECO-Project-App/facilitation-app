'use client';
import {useState} from 'react';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs/tabs';
import {useUserStore} from '@/store/userStore';
import ProfilePage from '../profile/page';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const AuthPage = () => {
  const user = useUserStore((state) => state.user);
  const [api, setApi] = useState<CarouselApi>();

  return (
    <>
      {user ? (
        <ProfilePage />
      ) : (
        <Tabs defaultValue="login" className="overflow-hidden p-4">
          <TabsList className="m-auto mt-14 grid h-12 w-80 grid-cols-2 bg-sky-300">
            <TabsTrigger
              value="login"
              className="text-green-100 h-10 border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black">
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="text-green-100 h-10 border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black">
              Signup
            </TabsTrigger>
          </TabsList>
          <Carousel className="h-full w-full flex-1" setApi={setApi}>
            <CarouselContent>
              <CarouselItem className="space-y-6">
                <LogIn />
              </CarouselItem>

              <CarouselItem className="space-y-6">
                <SignUp />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </Tabs>
      )}
    </>
  );
};

export default AuthPage;
