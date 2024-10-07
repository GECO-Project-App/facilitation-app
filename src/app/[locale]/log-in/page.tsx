'use client';
import {useState, useEffect} from 'react';
import {Switch} from '@/components/ui/switch/switch';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {motion, AnimatePresence} from 'framer-motion';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs/tabs';

const AuthPage = () => {
  return (
    <Tabs  defaultValue="login" className="p-4">
     <TabsList className="grid w-80 grid-cols-2 m-auto">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
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
