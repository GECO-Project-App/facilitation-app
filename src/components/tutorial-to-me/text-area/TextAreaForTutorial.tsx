'use client';
import {Textarea} from '@/components/ui/textarea/textarea';
import {useTutorialToMeAnswer} from '@/store/useTutorialToMeAnswer';

const TextAreaForTutorial = ({title, borderColor}: {title: string; borderColor: string}) => {
  const {setStrength_1, setStrength_2, setStrength_3} = useTutorialToMeAnswer();
  const {setWeakness_1, setWeakness_2, setWeakness_3} = useTutorialToMeAnswer();
  const {setCommunication_1, setCommunication_2, setCommunication_3} = useTutorialToMeAnswer();

  const write = (value: string, title: string) => {
    switch (title) {
      case 'Strength 1':
        setStrength_1(value);
        break;
      case 'Strength 2':
        setStrength_2(value);
        break;
      case 'Strength 3':
        setStrength_3(value);
        break;
      case 'Weakness 1':
        setWeakness_1(value);
        break;
      case 'Weakness 2':
        setWeakness_2(value);
        break;
      case 'Weakness 3':
        setWeakness_3(value);
        break;
      case 'Communication 1':
        setCommunication_1(value);
        break;
      case 'Communication 2':
        setCommunication_2(value);
        break;
      case 'Communication 3':
        setCommunication_3(value);
        break;
      default:
        break;
    }
  };
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
          onChange={(e) => write(e.target.value, title)}
        />
      </div>
    </aside>
  );
};

export default TextAreaForTutorial;
