'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
interface SurveyProps {
  title: string;
  onSubmit: (value: string | null) => void;
}

function Survey({title, onSubmit}: SurveyProps) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedValue);
    setSelectedValue('');
  };

  return (
    <article className="page-padding flex min-h-screen flex-col justify-evenly">
      <section className="flex w-full flex-row items-center justify-evenly gap-4">
        <Link href={'/exercises/ssc'}>
          <ArrowLeft size={42} />
        </Link>
        <header className="text-xl font-bold">
          <h2>Feedback</h2>
        </header>
      </section>
      <div>
        <div className="relative">
          <div className="absolute left-0 top-0 w-full rounded-t-3xl border-l-2 border-r-2 border-t-2 border-black bg-amber-50 bg-pink p-4 text-lg font-bold text-black">
            {title}
          </div>
          <textarea
            className="h-60 w-full rounded-3xl border-2 border-black p-4 pt-16 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
            placeholder="Have some thoughts, comments and suggestions about the app? Share your thought with us."
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
        </div>
      </div>
      <section className="flex justify-center">
        <Button variant="yellow" onClick={handleSubmit}>
          Send <ArrowRight size={38} />
        </Button>
      </section>
    </article>
  );
}

export default Survey;
