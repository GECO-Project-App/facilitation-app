'use client';
import SignUp from './SignUp';
import LogIn from './LogIn';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs/tabs';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'framer-motion';

const AuthPage = () => {
  const t = useTranslations('authenticate');

  const tabVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <Tabs defaultValue="login" className="mx-auto h-full max-w-[600px] overflow-hidden p-4">
      <TabsList className="m-auto mt-10 grid h-12 w-80 grid-cols-2 rounded-full bg-lightBlue">
        <TabsTrigger
          value="login"
          className="text-black h-10 rounded-full border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black">
          {t('logIn')}
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="text-black h-10 rounded-full border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black">
          {t('signUp')}
        </TabsTrigger>
      </TabsList>
      <AnimatePresence mode="wait">
        <TabsContent value="login" key="login" className="mt-10 h-full">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type: "spring", stiffness: 100, damping: 15}}>
            <LogIn />
          </motion.div>
        </TabsContent>
        <TabsContent value="signup" key="signup" className="mt-10 h-full">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type: "spring", stiffness: 100, damping: 15}}>
            <SignUp />
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
};

export default AuthPage;
