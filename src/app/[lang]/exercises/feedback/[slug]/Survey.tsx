'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import {useRouter} from 'next/navigation';
import TextArea from '../views/TextArea';
import {useKeyboardStatus} from '@/hooks/useKeyboardStatus';

interface SurveyProps {
  title: string;
  onSubmit: (value: string | null) => void;
}

function Survey({title, onSubmit}: SurveyProps) {
  const keyboardStatus = useKeyboardStatus();
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
    <article className={`page-padding flex flex-col overflow-y-hidden
      ${keyboardStatus.isKeyboardOpen ? 'justify-between h-[54vh]' : 'min-h-screen justify-evenly'} 
    `}>
      <TextArea
        key={title}
        title={title}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        handleBack={handleBack}
      />
      <section className="flex justify-center my-2">
        <Button variant="pink" onClick={handleSubmit}>
          Send <ArrowRight />
        </Button>
      </section>
    </article>
  );
}

export default Survey;
