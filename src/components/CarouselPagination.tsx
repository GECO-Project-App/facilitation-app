import {paginationColors} from '@/lib/mock';
import {cn} from '@/lib/utils';
import {FC, useCallback} from 'react';

type CarouselPaginationProps = {
  steps: Array<unknown>;
  currentStep: number;
};

export const CarouselPagination: FC<CarouselPaginationProps> = ({steps, currentStep = 0}) => {
  const Pagination = useCallback(() => {
    return (
      <ul className="flex w-fit flex-row items-center justify-center gap-1 rounded-full border-2 border-black bg-white px-4 py-3">
        {Array.from({length: steps.length}).map((_, index) => (
          <li
            key={index}
            className={cn(
              currentStep === index ? `opacity-1 h-8 w-8` : 'h-5 w-5 opacity-75',
              `animation-transition aspect-square rounded-full border-2 border-black text-xl shadow-small ${paginationColors[index]}`,
            )}>
            <h4
              className={cn(
                currentStep === index ? 'text-xl font-bold' : 'text-sm font-semibold',
                'animation-transition flex h-full items-center justify-center',
              )}>
              {index + 1}
            </h4>
          </li>
        ))}
      </ul>
    );
  }, [currentStep, steps]);

  return <Pagination />;
};
