import {useGetUsersById} from '@/hooks/useGetUsersById';

const UsersNotCompletedTutorialToMeTask = () => {
  const {teamMembersNotCompletedTask} = useGetUsersById();

  return (
    <div className="flex">
      {teamMembersNotCompletedTask.length > 0
        ? teamMembersNotCompletedTask.map((member) => (
            <div key={member.id}>
              {member.firstName} {member.lastName},&nbsp;
            </div>
          ))
        : null}
    </div>
  );
};

export default UsersNotCompletedTutorialToMeTask;
