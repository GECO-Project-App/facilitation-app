import HeaderWrapper from '@/components/styles/HeaderWrapper';
import {useTranslations} from 'next-intl';
import {useEffect, useRef, useState} from 'react';

interface TextAreaProps {
  title: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  handleBack: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  title,
  selectedValue,
  setSelectedValue,
  handleBack,
}: TextAreaProps) => {
  const t = useTranslations('feedback');
  const titleDivRef = useRef<HTMLDivElement>(null);
  const [paddingTop, setPaddingTop] = useState(0);

  useEffect(() => {
    if (titleDivRef.current) {
      setPaddingTop(titleDivRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <HeaderWrapper title="Feedback" handleBack={handleBack} />
      <div className={`relative h-[60vh]`}>
        <div
          ref={titleDivRef}
          className="absolute left-0 top-0 w-full rounded-t-3xl border-l-2 border-r-2 border-t-2 border-black bg-amber-50 bg-pink px-4 py-2 text-lg font-bold text-black">
          {title}
          <div className="text-xs font-normal text-gray-700">{t('title')}</div>
          <div className="text-xs font-normal text-gray-700">{t('subtitle')}</div>
        </div>
        <textarea
          className="h-full w-full rounded-3xl border-2 border-black px-4 shadow-[0px_6px_0px_rgb(0,0,0)] focus:outline-none"
          style={{paddingTop: `${paddingTop}px`}}
          value={selectedValue}
          placeholder={t('placeholder')}
          onChange={(e) => setSelectedValue(e.target.value)}
        />
      </div>
    </>
  );
};

export default TextArea;
