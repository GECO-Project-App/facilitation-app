// app/Survey.tsx
import { useState } from 'react'
import styles from './page.module.css'

interface SurveyProps {
  title: string;
  onDismiss: () => void;
  onSubmit: (value: number | null) => void;
}

function Survey({ title, onDismiss, onSubmit }: SurveyProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  }

  const handleSubmit = () => {
    onSubmit(selectedValue);
  }
  
  return (
    <article className={styles.survey}>
      <h2>{title}</h2>
      <div>
        {[...Array(10)].map((_, i) => (
          <button className={styles.button} key={i + 1} onClick={() => handleSelect(i + 1)}>{i + 1}</button>
        ))}
      </div>
      <div>
        <button className={styles.button} onClick={onDismiss}>Dismiss</button>
        <button className={styles.button} onClick={handleSubmit}>Submit</button>
      </div>
    </article>
  );
}

export default Survey;