'use client';
import {Link} from '@/i18n/routing';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {RiveAnimation} from './RiveAnimation';
export const GecoLoader = () => {
  const t = useTranslations('common');

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-svh h-full bg-yellow"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 1}}>
      <div className="flex flex-col items-center justify-center">
        <RiveAnimation src="bulbgecko.riv" />
        <h2 className=" font-bold text-6xl uppercase">Geco</h2>
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 1, delay: 4}}>
          <Link href="/" className="hover:underline">
            <h2>{t('goBack')}</h2>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
