'use client';
import {motion} from 'framer-motion';
import {RiveAnimation} from './RiveAnimation';

export const GecoLoader = () => {
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
      </div>
    </motion.div>
  );
};
