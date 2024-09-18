import React from 'react';
import {ReusableRive} from '@/components';

const Stop: React.FC = () => {
  return (
    <section>
      <header>
        <ReusableRive src="/assets/riv/stopgecko.riv" width="160px" height="160px" />
        <h1 className="text-2xl font-bold">
          Chapter 2:<span className="text-red-600">Stop</span>
        </h1>
        <span className="text-sm text-gray-500">4-5 minutes | 2-20 members</span>
      </header>
      <p>
        In this chapter, you will brainstorm and discuss what are the things you should{' '}
        <span className="font-bold">stop</span> doing as a community to better support the
        productivity, communication, etc. Give an example of how this point might help you and the
        community to thrive.
      </p>
    </section>
  );
};

export default Stop;
