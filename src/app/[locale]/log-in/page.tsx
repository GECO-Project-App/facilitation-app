'use client';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {motion} from 'framer-motion';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs/tabs';

const AuthPage = () => {
  return (
    <Tabs defaultValue="login" className="p-4 ">
      <TabsList className="h-12 grid w-80 grid-cols-2 m-auto bg-sky-300">
        <TabsTrigger 
          value="login" 
          className="h-10 text-green-100 data-[state=active]:bg-green data-[state=active]:text-black data-[state=active]:border-2 border-black"
        >
          Login
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="h-10 text-green-100 data-[state=active]:bg-green data-[state=active]:text-black data-[state=active]:border-2 border-black"
        >
          Signup
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <motion.div
          key="login"
          initial={{x: -300, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{x: 300, opacity: 0}}
          transition={{duration: 0.5}}>
          <LogIn />
        </motion.div>
      </TabsContent>
      <TabsContent value="signup">
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
  );
};

export default AuthPage;
