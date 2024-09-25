'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';

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
            <h2>{title}</h2>
            <h2>Exercise</h2>
          </header>
        </section>
        <div>
          <textarea
            className="h-40 w-full rounded-3xl border-2 border-black bg-amber-50 p-4 shadow-[0px_6px_0px_rgb(0,0,0)]"
            placeholder="Have some thoughts, comments and suggestions about the app? Share your thought with us."
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
        </div>
        <section className="flex justify-center">
          <Button variant="yellow" onClick={handleSubmit}>
            Send Us Feedback
          </Button>
        </section>
    </article>
  );
}

export default Survey;
