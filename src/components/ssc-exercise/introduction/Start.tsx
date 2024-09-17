import React from 'react';
import StartGecko from '@/components/rives/StartGecko';
const Start: React.FC = () => {
  return (
    <section>
        <header>
        {/* <img src="/assets/svg/start-intro.svg" alt="Start" /> */}
        <StartGecko />
            <h1 className="text-2xl font-bold">Chapter 1:<span className="text-amber-300">Start</span></h1>
            <span className="text-sm text-gray-500">4-5 minutes | 2-20 members</span>
        </header>
      <p>
        In this chapter, you will brainstorm and discuss what are the things you could <span className='font-bold'>start</span> doing
        as a community to better support the productivity, communication, etc. Give an example of
        how this might help you and the community to thrive.
      </p>
    </section>
  );
};

export default Start;
