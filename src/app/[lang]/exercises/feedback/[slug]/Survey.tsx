'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import HeaderWrapper from '@/components/styles/HeaderWrapper';
import {useRouter} from 'next/navigation';
import TextArea from './TextArea';
import { useKeyboardResize,  } from '@/hooks/useKeyboardResize';
import { useKeyboardStatus,  } from '@/hooks/useKeyboardStatus';

interface SurveyProps {
  title: string;
  onSubmit: (value: string | null) => void;
}

function Survey({title, onSubmit}: SurveyProps) {
  const keyboardHeight = useKeyboardResize();
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

  console.log(keyboardHeight);


  return (
    <article className="page-padding flex min-h-screen flex-col justify-evenly">
      <HeaderWrapper title={keyboardStatus.isKeyboardOpen.toString()} handleBack={handleBack} />

      <TextArea
        key={title}
        title={title}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        height={keyboardStatus.isKeyboardOpen ? '20vh' : '60vh'}
      />
      <section className="flex justify-center">
        <Button variant="pink" onClick={handleSubmit}>
          Send <ArrowRight />
        </Button>
      </section>
    </article>
  );
}

export default Survey;
