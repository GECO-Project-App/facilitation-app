'use client';
import {Button} from '@/components/ui/button';
import {useKeyboardStatus} from '@/hooks/useKeyboardStatus';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import TextArea from './views/TextArea';

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
    router.push('/');
  };

  const t = useTranslations('feedback');

  return (
    <article
      className={`flex flex-col gap-4 overflow-y-hidden ${keyboardStatus.isKeyboardOpen ? 'h-[54vh] justify-between' : 'min-h-screen justify-evenly'} `}>
      <TextArea
        key={title}
        title={title}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        handleBack={handleBack}
      />
      <section className="my-2 flex justify-center">
        <Button variant="pink" onClick={handleSubmit} disabled={!selectedValue}>
          {t('button')} <ArrowRight />
        </Button>
      </section>
    </article>
  );
}

export default Survey;
