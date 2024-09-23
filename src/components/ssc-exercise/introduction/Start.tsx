import React from 'react';
import {RiveAnimation} from '@/components';
const Start: React.FC = () => {
  return (
    <section>
      <header>
        {/* <img src="/assets/svg/start-intro.svg" alt="Start" /> */}
        <div className="text-center">
          <div className="flex justify-center">
            <RiveAnimation src="/assets/riv/ssc_startgecko.riv" />
          </div>
        </div>
        <h1 className="text-2xl font-bold pt-2">
          Chapter 1:<span className="text-amber-300">Start</span>
        </h1>
        <span className="text-sm text-gray-500">4-5 minutes | 2-20 members</span>
      </header>
      <p className="pt-4">
        In this chapter, you will brainstorm and discuss what are the things you could{' '}
        <span className="font-bold">start</span> doing as a community to better support the
        productivity, communication, etc. Give an example of how this might help you and the
        community to thrive.
      </p>
    </section>
  );
};

export default Start;
