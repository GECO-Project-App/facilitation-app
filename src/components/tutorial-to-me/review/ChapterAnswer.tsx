import {useGetUsersById} from '@/hooks/useGetUsersById';

interface ChapterAnswerProps {
  chapter: string;
  answers: string[];
  replyId: string;
}

const ChapterAnswer = ({chapter, answers, replyId}: ChapterAnswerProps) => {
  const {getUserById} = useGetUsersById();
  const user = getUserById(replyId);
  return (
    <section className="flex flex-col gap-4 h-full w-full">
      <div className="text-center pt-4 text-lg">{chapter}</div>
      <div className="p-4 text-lg font-bold text-white">
        {user?.firstName} {user?.lastName}
      </div>
      <div>
        {answers.map((answer) => (
          <div key={answer} className="pl-4 pt-2">
            <div className="pl-2">{answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChapterAnswer;
