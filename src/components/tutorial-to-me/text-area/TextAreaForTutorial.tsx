'use client';
import {Textarea} from '@/components/ui/textarea/textarea';

const TextAreaForTutorial = ({
  title,
  borderColor,
  setValue,
  value,
}: {
  title: string;
  borderColor: string;
  setValue: (value: string) => void;
  value: string;
}) => {
  return (
    <aside>
      <div className="grid w-full gap-1 text-center justify-center">
        <label htmlFor={title} className="font-bold">
          {title}
        </label>
        <Textarea
          id={title}
          rows={7}
          className={`w-[80vw] rounded-2xl border-2 focus:outline-none max-w-md`}
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
