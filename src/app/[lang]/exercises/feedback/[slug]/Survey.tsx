'use client'

import { useState } from 'react'

interface SurveyProps {
  title: string;
  onSubmit: (value: number | null) => void;
}

function Survey({ title, onSubmit }: SurveyProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  }

  const handleSubmit = () => {
    onSubmit(selectedValue);
  }
  
  return (
    <article>
      <h2>{title}</h2>
      <textarea></textarea>
        <button onClick={handleSubmit}>Submit</button>
      {/* <div>
        <button className={styles.button} onClick={handleSubmit}>Submit</button>
      </div> */}
    </article>
  );
}

export default Survey;