interface ChapterAnswerProps {
  chapter: string;
  answers: string[];
}

const ChapterAnswer = ({chapter, answers}: ChapterAnswerProps) => {
  return (
    <section className="flex flex-col gap-4 h-full w-full">
      <div className="text-center pt-4 text-lg">{chapter}</div>
      <div className="p-4 text-lg">Name: </div>
      <div>
        {answers.map((answer, index) => (
          <div key={answer} className="pl-4 pt-2">
            <div className="text-gray-500 text-sm opacity-90">{index + 1}.</div>
            <div className="pl-2">{answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChapterAnswer;
