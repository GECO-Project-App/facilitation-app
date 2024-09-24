// components/StyledWrapper.tsx
import React, { FC, ReactNode } from 'react';
import {ArrowLeft} from 'lucide-react';

interface HeaderWrapperProps {
//   children: ReactNode;
  title: string;
  handleBack: () => void;   
  currentStep: number;
}



const HeaderWrapper: FC<HeaderWrapperProps> = ({title, handleBack , currentStep}) => {
console.log(currentStep)
  return (
    <header className="flex w-full flex-row items-center justify-between pt-2">
    <ArrowLeft size={40} onClick={handleBack} />
    <h1 className={`rounded-full border-2 border-black pr-4 pl-4 pt-1 pb-1 text-xl font-bold ${
        currentStep === 1 ? 'bg-yellow' :
        currentStep === 2 ? 'bg-pink' :
        currentStep === 3 ? 'bg-pink' :
        currentStep === 4 ? 'bg-blue text-white' :
        currentStep === 5 ? 'bg-blue text-white' : ''    
    }`} >
      {title}
    </h1>
    <div className="h-10 w-10 rounded-full"></div>
  </header>
)

};

export default HeaderWrapper;
