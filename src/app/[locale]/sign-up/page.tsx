'use client';
import {useState} from 'react';
import {Switch} from '@/components/ui/switch/switch';
import SignUp from './SignUp';
const AuthPage = () => {

  const [isSwitched, setIsSwitched] = useState(true);
  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  return (
    <>
      <div className="container mx-auto flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md rounded-lg p-6">
          <div className="space-y-6 px-4">
            <div className="flex items-center justify-center space-x-4">
              <Switch id="terms" className="h-20 w-[88%]" onClick={handleSwitch} />
            </div>
            <SignUp />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
