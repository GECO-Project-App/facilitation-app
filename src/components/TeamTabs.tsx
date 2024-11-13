'use client';
import {AnimatePresence, motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {CreateTeamForm, JoinTeamForm} from './forms';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';

export const TeamTabs = () => {
  const t = useTranslations('team.tabs');

  const tabVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1},
    exit: {y: -20, opacity: 0},
  };

  return (
    <Tabs defaultValue="join" className="mx-auto w-fit">
      <TabsList className="bg-pink">
        <TabsTrigger value="join" variant="yellow">
          {t('join')}
        </TabsTrigger>
        <TabsTrigger value="create" variant="yellow">
          {t('create')}
        </TabsTrigger>
      </TabsList>
      <AnimatePresence mode="popLayout">
        <TabsContent value="join" key="join">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type: 'spring', stiffness: 100, damping: 15}}>
            <JoinTeamForm />
          </motion.div>
        </TabsContent>

        <TabsContent value="create" key="create">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{type: 'spring', stiffness: 100, damping: 15}}>
            <CreateTeamForm />
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
};
