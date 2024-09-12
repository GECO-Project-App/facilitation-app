import React from 'react';
import { ArrowLeft } from 'lucide-react';
const Tips: React.FC = () => {
  return (

    <main className="page-padding flex min-h-screen flex-col bg-yellow">
   
    <section className="flex flex-1 flex-col items-center justify-evenly text-black">
      <div className='flex flex-row items-center justify-between'>
      <ArrowLeft size={42} />
      <h2 className='text-2xl font-bold'>Tips for SSC Exercise</h2>
      </div>
      <h4 className='text-md font-semibold'>Points to keep it mind when doing the exercise,</h4>
      <ul>
        <li className='font-bold'>1. Set clear expectations</li>
        <li className='font-bold'>2. Provide a visual aid</li>
        <li className='font-bold'>3. Stay on track</li>
        <li className='font-bold'>4. Record responses</li>
        <li className='font-bold'>5. Analyze feedback and create a plan of action</li>
      </ul>
    </section>
  </main>













  );
};

export default Tips;
