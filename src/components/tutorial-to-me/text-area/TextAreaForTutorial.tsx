'use client';
import {Textarea} from '@/components/ui/textarea/textarea';

const TextAreaForTutorial = ({title, borderColor}: {title: string; borderColor: string}) => {
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
          style={{
            borderColor: borderColor,
          }}
        />
      </div>
    </aside>
  );
};

export default TextAreaForTutorial;
