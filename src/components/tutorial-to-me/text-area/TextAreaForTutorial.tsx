'use client';
import {Textarea} from '@/components/ui/textarea/textarea';

const TextAreaForTutorial = ({
  title,
  borderColor,
  setValue,
  value,
  placeholder,
}: {
  title: string;
  borderColor: string;
  setValue: (value: string) => void;
  value: string;
  placeholder?: string;
}) => {
  return (
    <aside className="h-[40vh]">
      <div className="flex flex-col w-full h-full justify-center items-center">
        <label htmlFor={title} className="font-bold h-10">
          {title}
        </label>
        <Textarea
          id={title}
          placeholder={placeholder ? placeholder : ''}
          rows={10}
          className={`rounded-2xl border-2 focus:outline-none h-full w-[90%] sm:w-full`}
          value={value}
          style={{
            borderColor: borderColor,
          }}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </aside>
  );
};

export default TextAreaForTutorial;
