'use client';
import {Header} from './Header';
import {PageLayout} from './PageLayout';

export const ProfileStats = () => {
  return (
    <PageLayout header={<Header />} backgroundColor="bg-pink" contentColor="bg-pink">
      <div className="text-center space-y-1">
        <h3 className=" text-xl font-bold">Name</h3>
        <p>role</p>
      </div>
      <section className="bg-white  rounded-full mx-auto h-32 w-32"> hej</section>
      <section className="grid grid-cols-1 gap-4">
        {
          /* stats */

          ['Strength', 'Weakness', 'Communication Style', 'Skills Assessment'].map((stat) => (
            <div key={stat}>
              <h4>{stat}:</h4>
              <p className="font-light">Value</p>
            </div>
          ))
        }
      </section>
    </PageLayout>
  );
};
