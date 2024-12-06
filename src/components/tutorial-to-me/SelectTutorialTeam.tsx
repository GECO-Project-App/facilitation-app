import {TeamSelect} from '@/components';
import {Team} from '@/lib/types';
import {FC} from 'react';

const SelectTutorialTeam: FC<{selectedTeam: Team[]; disableCreateOrJoin?: boolean}> = ({
  selectedTeam,
  disableCreateOrJoin = false,
}) => {
  return (
    <div className="w-[68%] mx-auto py-2">
      {selectedTeam && selectedTeam.length > 0 && (
        <TeamSelect teams={selectedTeam} disableCreateOrJoin={disableCreateOrJoin} />
      )}
    </div>
  );
};

export default SelectTutorialTeam;
