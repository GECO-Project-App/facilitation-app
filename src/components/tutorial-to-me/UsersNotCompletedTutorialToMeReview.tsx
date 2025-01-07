import {useGetUsersById} from '@/hooks/useGetUsersById';

const UsersNotCompletedTutorialToMeReview = () => {
  const {teamMembersNotCompletedReviewed} = useGetUsersById();
  return (
    <div className="flex">
      {teamMembersNotCompletedReviewed.length > 0
        ? teamMembersNotCompletedReviewed.map((member) => (
            <div key={member.id}>
              {member.firstName} {member.lastName},&nbsp;
            </div>
          ))
        : null}
    </div>
  );
};

export default UsersNotCompletedTutorialToMeReview;
