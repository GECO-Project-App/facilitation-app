'use client';
import {useState} from 'react';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs/tabs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const AuthPage = () => {
  const [api, setApi] = useState<CarouselApi>();

  const loginTab = () => {
    api?.scrollPrev();
  };

  const signupTab = () => {
    api?.scrollNext();
  };

  return (
    <Tabs defaultValue="login" className="mx-auto h-full max-w-[600px] overflow-hidden p-4">
      <TabsList className="m-auto mt-14 grid h-12 w-80 grid-cols-2 rounded-full bg-sky-300">
        <TabsTrigger
          value="login"
          className="text-green-100 h-10 rounded-full border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black"
          onClick={loginTab}>
          Login
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="text-green-100 h-10 rounded-full border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black"
          onClick={signupTab}>
          Signup
        </TabsTrigger>
      </TabsList>
      <Carousel setApi={setApi} className="mt-20 h-full">
        <CarouselContent>
          <CarouselItem className="space-y-6" key="login">
            <LogIn />
          </CarouselItem>
          <CarouselItem className="space-y-6" key="signup">
            <SignUp />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </Tabs>
  );
};

export default AuthPage;
