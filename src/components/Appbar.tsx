import React from 'react';

const AppBar: React.FC = () => {
  return (
    <div className="flex h-[40px] w-full items-center justify-between bg-red border-b-2 border-black p-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">GECO</h1>
      </div>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">GECO</h1>
      </div>
    </div>
  );
};

export default AppBar;
