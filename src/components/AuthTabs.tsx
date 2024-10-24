'use client';
import {AnimatePresence, motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {LoginForm, SignUpForm} from './forms';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';

export const AuthTabs = () => {
  const t = useTranslations('authenticate');

  const tabVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1},
    exit: {y: -20, opacity: 0},
  };

  return (
    <Tabs defaultValue="login" className="mx-auto w-fit">
      <TabsList className="bg-lightBlue">
        <TabsTrigger value="login">{t('logIn')}</TabsTrigger>
        <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
      </TabsList>
      <AnimatePresence mode="popLayout">
        <TabsContent value="login" key="login">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type: 'spring', stiffness: 100, damping: 15}}>
            <LoginForm />
          </motion.div>
        </TabsContent>

        <TabsContent value="signup" key="signup">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type: 'spring', stiffness: 100, damping: 15}}>
            <SignUpForm />
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
};
