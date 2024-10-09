import {ArrowLeft, ArrowRight} from 'lucide-react';
import {FC} from 'react';

interface HeaderWrapperProps {
  title: string;
  handleBack?: () => void;
  handleForward?: () => void;
  currentStep?: number;
}

const HeaderWrapper: FC<HeaderWrapperProps> = ({title, handleBack, handleForward, currentStep}) => {
  return (
    <header className="flex w-full flex-row items-center justify-between pt-2">
      <div className="h-10 w-10 rounded-full">
        {handleBack && <ArrowLeft size={40} onClick={handleBack} />}
      </div>
      <h1
        className={`rounded-full border-2 border-black pb-1 pl-4 pr-4 pt-1 text-xl font-bold ${
          currentStep === 1
            ? 'bg-yellow'
            : currentStep === 2
              ? 'bg-pink'
              : currentStep === 3
                ? 'bg-pink'
                : currentStep === 4
                  ? 'bg-blue text-white'
                  : currentStep === 5
                    ? 'bg-blue text-white'
                    : 'bg-purple'
        }`}>
        {title}
      </h1>
      <div className="h-10 w-10 rounded-full">
        {handleForward && <ArrowRight size={40} onClick={handleForward} />}
      </div>
    </header>
  );
};

export default HeaderWrapper;
