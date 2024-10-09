'use client';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {motion} from 'framer-motion';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs/tabs';
import {useUserStore} from '@/store/userStore';
import ProfilePage from '../profile/page';

const AuthPage = () => {
  const user = useUserStore((state) => state.user);
  return (
    <>
      {user ? (
        <ProfilePage/>
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
          <TabsContent value="login" className="mt-32">
            <motion.div
              key="login"
              initial={{x: -300, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x: 300, opacity: 0}}
              transition={{duration: 0.5}}>
              <LogIn />
            </motion.div>
          </TabsContent>
          <TabsContent value="signup" className="mt-32">
            <motion.div
              key="signup"
              initial={{x: 300, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x: -300, opacity: 0}}
              transition={{duration: 0.5}}>
              <SignUp />
            </motion.div>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default AuthPage;
