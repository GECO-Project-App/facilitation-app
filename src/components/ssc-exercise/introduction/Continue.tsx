import React from 'react';
import {RiveAnimation} from '@/components';

const Continue: React.FC = () => {
  return (
    <section>
      <header>
        <div className="flex justify-center">
          <RiveAnimation src="/assets/riv/ssc_continuegecko.riv" />
        </div>
        <h1 className="text-2xl font-bold pt-2">
          Chapter 3:<span className="text-green">Continue</span>
        </h1>
        <span className="text-sm text-gray-500">4-5 minutes | 2-20 members</span>
      </header>
      <p className="pt-4">
        In this chapter, you will brainstorm and discuss what are the things you sould{' '}
        <span className="font-bold">continue</span> doing as a community to better support the
        productivity, communication, etc. Give an example doing as a community to better support the
        productivity, communication, etc. Give an example of how this might help you and the
        community to thrive.{' '}
      </p>
    </section>
  );
};

export default Continue;
