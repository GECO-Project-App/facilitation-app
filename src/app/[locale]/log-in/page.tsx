'use client';
import {useState, useEffect} from 'react';
import {Switch} from '@/components/ui/switch/switch';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {motion, AnimatePresence} from 'framer-motion';

const AuthPage = () => {
  const [isSwitched, setIsSwitched] = useState(true);
  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  return (
    <>
      <div className="container mx-auto min-h-screen overflow-hidden bg-white">
        <div className="w-full max-w-md rounded-lg p-6">
          <div className="space-y-6 px-4">
            <div className="flex items-center justify-center space-x-4 pt-10">
              <Switch id="terms" className="h-20 w-[88%]" onClick={handleSwitch} />
            </div>
            <div className="pt-[40%]">
              <AnimatePresence mode="wait">
                {isSwitched ? (
                  <motion.div
                    key="login"
                    initial={{x: -300, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: 300, opacity: 0}}
                    transition={{duration: 0.5}}>
                    <LogIn />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{x: 300, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: -300, opacity: 0}}
                    transition={{duration: 0.5}}>
                    <SignUp />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
