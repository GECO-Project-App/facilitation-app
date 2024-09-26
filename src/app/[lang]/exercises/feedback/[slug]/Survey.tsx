'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
import {useRouter} from 'next/navigation';

interface SurveyProps {
  title: string;
  onSubmit: (value: string | null) => void;
}

function Survey({title, onSubmit}: SurveyProps) {
  const [selectedValue, setSelectedValue] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    onSubmit(selectedValue);
    setSelectedValue('');
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <article className="page-padding flex min-h-screen flex-col justify-evenly">
      <HeaderWrapper title="Feedback" handleBack={handleBack} />
      <div>
        <div className="relative">
          <div className="absolute left-0 top-0 w-full rounded-t-3xl border-l-2 border-r-2 border-t-2 border-black bg-amber-50 bg-pink p-4 text-lg font-bold text-black">
            {title}
            <div className="text-xs font-normal text-gray-700">
              What worked well during this exercise?
            </div>
            <div className="text-xs font-normal text-gray-700">What didn't?</div>
          </div>
          <textarea
            className="h-80 w-full rounded-3xl border-2 border-black p-4 pt-16 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
        </div>
      </div>
      <section className="flex justify-center">
        <Button variant="pink" onClick={handleSubmit}>
          Send <ArrowRight />
        </Button>
      </section>
    </article>
  );
}

export default Survey;
